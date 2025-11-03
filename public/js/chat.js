const socket = io();
let messages = [];
let replyingTo = null; // Stores the message object being replied to

const replyPreview = document.getElementById("replyPreview");
const replyUsername = document.getElementById("replyUsername");
const replyMessageContent = document.getElementById("replyMessageContent");
const cancelReplyBtn = document.getElementById("cancelReplyBtn");

sendBtn.addEventListener("click", () => {
    const msg = msgInput.value.trim();
    const key = keyInput.value.trim();
    const user = userInput.value.trim();
    if (msg && key && user) {
        const messageData = {
            user: user,
            content: msg
        };

        if (replyingTo) {
            messageData.replyTo = {
                id: replyingTo.id,
                user: replyingTo.user,
                content: replyingTo.content
            };
            cancelReply(); // Clear reply state after sending
        }

        const finalMsg = JSON.stringify(messageData);
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

socket.on("chat message", (messageObject) => {
    messages.push(messageObject);
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
    messages.forEach(messageObject => {
        let decrypted = "";
        try {
            const encryptedMsg = messageObject.content;
            decrypted = CryptoJS.AES.decrypt(encryptedMsg, key).toString(CryptoJS.enc.Utf8);
            const msgData = JSON.parse(decrypted);
            const messageId = messageObject.id; // Use server-generated unique ID

            const div = document.createElement("div");
            div.className = currentUser === msgData.user ? "message self" : "message other";
            div.dataset.messageId = messageId; // Add data attribute for reply
            div.addEventListener('click', (event) => {
                // Only set reply if not clicking on the recall button
                if (!event.target.classList.contains('recall-btn')) {
                    const contentToReply = messageObject.deleted ? "此訊息已撤回" : msgData.content;
                    setReply(messageId, msgData.user, contentToReply, msgData.color);
                }
            });

            // Display reply if exists
            if (msgData.replyTo) {
                const replyDiv = document.createElement("div");
                replyDiv.className = "message-reply-preview";
                replyDiv.innerHTML = `回覆 <span class="reply-username">${msgData.replyTo.user}</span>: <span class="reply-content-text">${msgData.replyTo.content}</span>`;
                div.appendChild(replyDiv);
            }

            const header = document.createElement("div");
            header.className = "message-header";

            const userName = document.createElement("span");
            userName.className = "username";
            userName.textContent = msgData.user;

            const time = document.createElement("span");
            time.className = "time";
            const serverTime = new Date(messageObject.timestamp);
            time.textContent = serverTime.toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            header.appendChild(userName);
            header.appendChild(time);

            // Add recall button for own messages
            if (currentUser === msgData.user && !messageObject.deleted) {
                const recallBtn = document.createElement("button");
                recallBtn.className = "recall-btn";
                recallBtn.textContent = "撤回";
                recallBtn.addEventListener('click', () => {
                    socket.emit("recall message", messageId);
                });
                header.appendChild(recallBtn);
            }

            div.appendChild(header);

            const content = document.createElement("div");
            content.className = "message-content";
            content.textContent = messageObject.deleted ? "此訊息已撤回" : msgData.content;
            if (messageObject.deleted) {
                content.classList.add("recalled-message");
            }
            div.appendChild(content);

            chatDiv.appendChild(div);
        } catch (e) {
            // If decryption fails, do not display the message
            // This restores the behavior of hiding undecryptable messages
        }
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

socket.on("message recalled", (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
        messages[messageIndex].deleted = true;
        renderMessages();
    }
});

function setReply(messageId, username, content) {
    replyingTo = { id: messageId, user: username, content: content };
    replyUsername.textContent = username;
    replyMessageContent.textContent = content;
    replyPreview.style.display = "flex";
    msgInput.focus();
}

function cancelReply() {
    replyingTo = null;
    replyPreview.classList.add("hidden");
    replyPreview.addEventListener("animationend", () => {
        replyPreview.style.display = "none";
        replyPreview.classList.remove("hidden");
    }, { once: true });
    replyUsername.textContent = "";
    replyMessageContent.textContent = "";
}

cancelReplyBtn.addEventListener("click", cancelReply);
