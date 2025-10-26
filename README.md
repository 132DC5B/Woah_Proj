# 簡介
Woah_Proj 是一個以 Express + Socket.IO 為基礎的即時聊天示範（前端放在 public/，伺服器為 server.js）。此專案已設計為端對端加密（E2EE）架構：訊息在用戶端加密後才送出，伺服器僅作為中繼與加密字串的儲存與廣播。

# 運作原理
- 金鑰與加密模式  
  - 用戶端必須手動輸入相同的對稱金鑰（或通行碼）。只有兩端使用相同金鑰時，才能互相解密並閱讀訊息。  

- 訊息流程  
  1. 使用者在前端輸入訊息並以手動設定的金鑰進行加密，產生 encryptedMsg（字串）。  
  2. 前端透過 Socket.IO 發送事件 "chat message"，參數為 encryptedMsg。  
  3. 伺服器（server.js）收到 encryptedMsg：  
     - 以換行方式附加到 chat.txt 作為紀錄（每行一則加密字串）。  
     - 使用 io.emit("chat message", encryptedMsg) 廣播給所有連線的 client（伺服器不會嘗試解密）。  
  4. 其他用戶端收到廣播後，使用本地輸入的金鑰嘗試解密並顯示明文（若金鑰不匹配則無法解密）。

- 歷史訊息（GET /messages）  
  - 伺服器提供 GET /messages，會讀取 chat.txt、按行分割並回傳 JSON { messages: [...] }，回傳的仍為加密字串，客戶端負責解密。

- 伺服器行為與隱私
  - 伺服器會記錄連線原始 IP（從 socket handshake 取得），並永久或暫時保存加密字串（chat.txt）。  
  - 伺服器端不持有或管理用戶端金鑰，且不會在目前實作中解密訊息；因此機密性的核心依賴於用戶端的金鑰安全與交換方式。

- 風險與建議  
  - 金鑰分享：手動輸入金鑰需透過安全的離線或受信通道（OOB）分享，避免在公開渠道傳送金鑰。   
  - 傳輸安全：部署時請務必使用 HTTPS/TLS 以保護 WebSocket 與 API 路徑的傳輸隱私。  
  - 儲存安全：chat.txt 中保存的仍為加密字串，但若金鑰外洩，歷史訊息將可被解密；視需求考慮加強儲存端加密或縮短保留期限。

# 相依套件（來自 package.json）
- express (^5.1.0)
- socket.io (^4.8.1)
- ws (^8.18.3)
- body-parser (^2.2.0)
- fs (^0.0.1-security)

scripts:
- start: node server.js

# 快速開始（本機）
1. Clone 倉庫
   git clone https://github.com/132DC5B/Woah_Proj.git
   cd Woah_Proj

2. 安裝相依套件
   npm install

3. 啟動伺服器
   npm start

4. 開啟瀏覽器
   http://localhost:3000
   （server.js 目前預設監聽 3000）