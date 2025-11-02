const socket = io();
let messages = [];

sendBtn.addEventListener("click", () => {
    const msg = msgInput.value.trim();
    const key = keyInput.value.trim();
    const user = userInput.value.trim();
    if (msg && key && user) {
        const time = new Date().toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const finalMsg = JSON.stringify({
            user: user,
            content: msg,
            time: time
        });
        const encrypted = CryptoJS.AES.encrypt(finalMsg, key).toString();
        socket.emit("chat message", encrypted);
        msgInput.value = "";
    }
});

msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
    }
});

clearKeyBtn.addEventListener("click", () => {
    keyInput.value = "";
    renderMessages();
});

socket.on("chat message", (encryptedMsg) => {
    messages.push(encryptedMsg);
    renderMessages();
});

loadBtn.addEventListener("click", async () => {
    const res = await fetch("/messages");
    const data = await res.json();
    messages = data.messages;
    renderMessages();
});

keyInput.addEventListener("input", () => {
    renderMessages();
});

function renderMessages() {
    const key = keyInput.value.trim();
    const currentUser = userInput.value.trim();
    chatDiv.innerHTML = "";
    messages.forEach(encryptedMsg => {
        let decrypted = "";
        try {
            decrypted = CryptoJS.AES.decrypt(encryptedMsg, key).toString(CryptoJS.enc.Utf8);
            const msgData = JSON.parse(decrypted);

            const div = document.createElement("div");
            div.className = currentUser === msgData.user ? "message self" : "message other";

            const header = document.createElement("div");
            header.className = "message-header";

            const userName = document.createElement("span");
            userName.className = "username";
            userName.textContent = msgData.user;

            const time = document.createElement("span");
            time.className = "time";
            time.textContent = msgData.time;

            const content = document.createElement("div");
            content.className = "message-content";
            content.textContent = msgData.content;

            header.appendChild(userName);
            header.appendChild(time);
            div.appendChild(header);
            div.appendChild(content);

            chatDiv.appendChild(div);
        } catch (e) { }
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
}
