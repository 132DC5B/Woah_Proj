# 簡介
Woah_Proj 是一個以 `Express` + `Socket.IO` 為基礎的輕量即時聊天範例，實作端對端加密（E2EE）。  
- 使用者需在前端手動輸入相同的「對稱金鑰」，只有金鑰相同的用戶才能正確解密並閱讀訊息。  
- 伺服器（`server.js`）只作為中繼與加密字串儲存（`chat.txt`），不會解密訊息。

# 運作原理
### 1) E2EE加密與金鑰管理
- 用戶端負責：金鑰輸入、訊息加密、收到訊息後的解密。  
- 伺服器不持有金鑰：伺服器只接收與廣播已加密的字串。

### 2) 訊息傳遞流程（步驟化）
1. 使用者在前端輸入明文並使用本地金鑰加密，產生 `encryptedMsg`（字串）。  
2. 前端透過 Socket.IO 發送事件 `socket.emit('chat message', encryptedMsg)`。  
3. 伺服器行為（`server.js`）：  
   - 將 `encryptedMsg` 以換行附加到 `chat.txt`（作為歷史紀錄）。  
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

# 快速開始（本機）
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

- 開啟瀏覽器 (`server.js` 目前預設監聽 3000)
   ```
  http://localhost:3000
   ```
