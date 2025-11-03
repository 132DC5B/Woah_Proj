const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DB_FILE = path.join(__dirname, "db.json");
const adapter = new JSONFile(DB_FILE);
const defaultData = { messages: [] }; // 定義預設資料
const db = new Low(adapter, defaultData); // 在建構子中提供預設資料

// 初始化資料庫 (讀取現有資料，如果有的話)
async function initializeDb() {
  await db.read();
  // 如果 db.json 是空的或不存在，db.data 將會是 defaultData
  // 不再需要 db.data = db.data || { messages: [] };
  await db.write(); // 確保如果檔案不存在，會用預設資料創建檔案
}
initializeDb();

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/messages", async (req, res) => {
  await db.read();
  res.json({ messages: db.data.messages });
});

io.on("connection", (socket) => {
  const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  console.log(`A user connected from IP: ${clientIp}`);

  socket.on("chat message", async (encryptedMsg) => {
    const messageObject = {
      id: uuidv4(), // Generate unique ID for the message
      content: encryptedMsg,
      timestamp: new Date().toISOString(),
      deleted: false // Add deleted flag for message recall
    };
    await db.read();
    db.data.messages.push(messageObject);
    await db.write();
    io.emit("chat message", messageObject);
  });

  socket.on("recall message", async (messageId) => {
    await db.read();
    const messageIndex = db.data.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      db.data.messages[messageIndex].deleted = true;
      await db.write();
      io.emit("message recalled", messageId); // Notify clients about the recall
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
