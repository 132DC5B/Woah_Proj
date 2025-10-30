import { state } from './state.js';

export function encryptMessage(finalMsg, key) {
 return CryptoJS.AES.encrypt(finalMsg, key).toString();
}

export function decryptMessage(encryptedMsg, key) {
 try {
 const decrypted = CryptoJS.AES.decrypt(encryptedMsg, key).toString(CryptoJS.enc.Utf8);
 return JSON.parse(decrypted);
 } catch (e) {
 return null;
 }
}

export function sendMessage() {
 const d = state.dom;
 const msg = d.msgInput.value.trim();
 const key = d.keyInput.value.trim();
 const user = d.userInput.value.trim();
 if (msg && key && user) {
 const time = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
 const finalMsg = JSON.stringify({ user: user, content: msg, time: time });
 const encrypted = encryptMessage(finalMsg, key);
 state.socket.emit('chat message', encrypted);
 d.msgInput.value = '';
 }
}

export function renderMessages() {
 const d = state.dom;
 const key = d.keyInput.value.trim();
 const currentUser = d.userInput.value.trim();
 d.chatDiv.innerHTML = '';
 state.messages.forEach(encryptedMsg => {
 const msgData = decryptMessage(encryptedMsg, key);
 if (!msgData) return;
 const div = document.createElement('div');
 div.className = currentUser === msgData.user ? 'message self' : 'message other';
 const header = document.createElement('div'); header.className = 'message-header';
 const userName = document.createElement('span'); userName.className = 'username'; userName.textContent = msgData.user;
 const time = document.createElement('span'); time.className = 'time'; time.textContent = msgData.time;
 const content = document.createElement('div'); content.className = 'message-content'; content.textContent = msgData.content;
 header.appendChild(userName); header.appendChild(time); div.appendChild(header); div.appendChild(content);
 d.chatDiv.appendChild(div);
 });
 d.chatDiv.scrollTop = d.chatDiv.scrollHeight;
}
