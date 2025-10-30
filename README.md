# Woah_Project

[English](#english) | [繁體中文](#繁體中文)

---

## 繁體中文

# 簡介
Woah_Proj 是一個以 `Express` + `Socket.IO` 為基礎的輕量即時聊天範例，實作端對端加密（E2EE）。

- 使用者需在前端手動輸入相同的「對稱金鑰」，只有金鑰相同的用戶才能正確解密並閱讀訊息。 
- 伺服器（`server.js`）只作為中繼與加密字串儲存（`chat.txt`），不會解密訊息。

## 運作原理

### 1) E2EE 加密與金鑰管理

- 用戶端負責：金鑰輸入、訊息加密、收到訊息後的解密。 
- 伺服器不持有金鑰：伺服器只接收與廣播已加密的字串。

### 2) 訊息傳遞流程（步驟化）

1. 使用者在前端輸入明文並使用本地金鑰加密，產生 `encryptedMsg`（字串）。 
2. 前端透過 Socket.IO 發送事件 `socket.emit('chat message', encryptedMsg)`。 
3. 伺服器行為（`server.js`）：
 - 將 `encryptedMsg`以換行附加到 `chat.txt`（作為歷史紀錄）。
 - 呼叫 `io.emit('chat message', encryptedMsg)` 廣播給所有連線的客戶端。
4. 其他用戶端收到後使用本地金鑰嘗試解密並顯示明文；若金鑰不匹配則無法解密。

### 3) 歷史訊息存取

- API：`GET /messages` 
 - 伺服器讀取 `chat.txt`，按行分割並回傳 JSON： 
 `{ "messages": [ "encryptedLine1", "encryptedLine2", ... ] }` 
 - 回傳內容仍為加密字串，客戶端負責解密顯示。

### 4) 安全提示（快速清單）

- 金鑰分享：請透過安全通道（離線或受信任的 OOB）交換金鑰，切勿在公開聊天室或訊息內貼出金鑰。 
- 金鑰強度：使用高熵金鑰或由密碼衍生（PBKDF2/Argon2）產生。 
- 傳輸安全：部署時務必啟用 HTTPS/TLS（保護 WebSocket 與 API）。 
- 儲存風險：`chat.txt` 儲存加密字串；若金鑰外洩，歷史訊息可被解密。

## 快速開始（本機）

- Clone 倉庫
 ```bash
 git clone https://github.com/132DC5B/Woah_Proj.git
 cd Woah_Proj
 ```

- 安裝相依套件
 ```bash
 npm install
 ```

- 啟動伺服器
 ```bash
 npm start
 ```

- 開啟瀏覽器 (`server.js`目前預設監聽3000)
 ```
 http://localhost:3000
 ```
 # 鳴謝 @chanLik1208-dev
---

## English

# Introduction
Woah_Proj is a lightweight real-time chat example built with `Express` + `Socket.IO` that demonstrates end-to-end encryption (E2EE).

- Users must manually enter the same symmetric key in the client; only clients with the same key can decrypt and read messages. 
- The server (`server.js`) acts only as a relay and stores encrypted strings in `chat.txt`; it does not decrypt messages.

# How it works

### 1) E2EE and key management

- Client responsibilities: entering the key, encrypting outgoing messages, and decrypting incoming messages. 
- The server never holds the keys: it only receives and broadcasts encrypted strings.

### 2) Message flow (step-by-step)

1. A user types plaintext in the client and encrypts it locally with the shared key, producing `encryptedMsg` (a string). 
2. The client sends the encrypted string via Socket.IO: `socket.emit('chat message', encryptedMsg)`. 
3. Server behavior (`server.js`):
 - Append `encryptedMsg` as a newline to `chat.txt` (history log).
 - Call `io.emit('chat message', encryptedMsg)` to broadcast the encrypted string to all connected clients.
4. Other clients receive the encrypted string and attempt to decrypt it locally; if the key doesn't match, decryption fails and the message is unreadable.

### 3) Accessing message history

- API: `GET /messages` 
 - The server reads `chat.txt`, splits lines, and returns JSON: 
 `{ "messages": [ "encryptedLine1", "encryptedLine2", ... ] }` 
 - The returned content is still encrypted; clients must decrypt for display.

### 4) Security notes (quick checklist)

- Key exchange: share keys using a secure channel (offline or trusted OOB), never post keys in public chat. 
- Key strength: use high-entropy keys or derive them from passwords (PBKDF2/Argon2).
- Transport security: enable HTTPS/TLS in production to protect WebSocket and API transport.
- Storage risk: `chat.txt` stores encrypted strings—if keys are leaked, historical messages can be decrypted.

# Quick start (local)

- Clone the repo
 ```bash
 git clone https://github.com/132DC5B/Woah_Proj.git
 cd Woah_Proj
 ```

- Install dependencies
 ```bash
 npm install
 ```

- Start the server
 ```bash
 npm start
 ```

- Open the browser (server listens on port3000 by default)
 ```
 http://localhost:3000
 ```

---
