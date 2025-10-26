const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const CHAT_FILE = path.join(__dirname, "chat.txt");

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/messages", (req, res) => {
  if (fs.existsSync(CHAT_FILE)) {
    const content = fs.readFileSync(CHAT_FILE, "utf-8");
    const messages = content.split("\n").filter(line => line.trim() !== "");
    res.json({ messages });
  } else {
    res.json({ messages: [] });
  }
});

io.on("connection", (socket) => {
  const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  console.log(`A user connected from IP: ${clientIp}`);

  socket.on("chat message", (encryptedMsg) => {
    fs.appendFileSync(CHAT_FILE, encryptedMsg + "\n");
    io.emit("chat message", encryptedMsg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
