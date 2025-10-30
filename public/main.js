const socket = io();
const chatDiv = document.getElementById("chat");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const keyInput = document.getElementById("key");
const userInput = document.getElementById("user");
const loadBtn = document.getElementById("loadBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const themeSelect = document.getElementById("themeSelect");
const fontSelect = document.getElementById("fontSelect");
const langSelect = document.getElementById("langSelect");
const clearKeyBtn = document.getElementById("clearKeyBtn");
const toggleTopBarBtn = document.getElementById("toggleTopBarBtn");

const i18n = window.LANG;

let settings = JSON.parse(localStorage.getItem('chatSettings')) || {
 theme: 'dark',
 fontSize: 'medium',
 lang: 'en_GB',
 showTopBar: true
};

function applySettings() {
 document.body.className = settings.theme;
 document.body.classList.remove('font-small', 'font-medium', 'font-large');
 const fontClass = { small: 'font-small', medium: 'font-medium', large: 'font-large' }[settings.fontSize] || 'font-medium';
 document.body.classList.add(fontClass);
 themeSelect.value = settings.theme;
 fontSelect.value = settings.fontSize;
 langSelect.value = settings.lang;
 const topBar = document.querySelector('.top-bar');
 if (settings.showTopBar) topBar.classList.remove('collapsed'); else topBar.classList.add('collapsed');
 document.documentElement.lang = settings.lang;
 const lang = settings.lang;
 document.querySelector('h2').textContent = i18n[lang].title;
 document.querySelector('h3').textContent = i18n[lang].subtitle;
 userInput.placeholder = i18n[lang].userPlaceholder;
 keyInput.placeholder = i18n[lang].keyPlaceholder;
 msgInput.placeholder = i18n[lang].msgPlaceholder;
 sendBtn.textContent = i18n[lang].send;
 loadBtn.textContent = i18n[lang].load;
 clearKeyBtn.textContent = i18n[lang].clearKey;
 document.querySelector('.modal-content h4').textContent = i18n[lang].settings;
 document.querySelector('label[for="themeSelect"]').textContent = i18n[lang].theme;
 document.querySelector('label[for="fontSelect"]').textContent = i18n[lang].fontSize;
 document.getElementById('labelLang').textContent = i18n[lang].lang;
 closeSettingsBtn.textContent = i18n[lang].close;
 themeSelect.options[0].text = i18n[lang].dark;
 themeSelect.options[1].text = i18n[lang].light;
 fontSelect.options[0].text = i18n[lang].small;
 fontSelect.options[1].text = i18n[lang].medium;
 fontSelect.options[2].text = i18n[lang].large;
 const currentLang = settings.lang;
 langSelect.innerHTML = '';
 Object.keys(window.LANG).forEach((code) => {
 const opt = document.createElement('option');
 opt.value = code;
 opt.text = (i18n[currentLang] && i18n[currentLang][code]) || code;
 if (code === currentLang) opt.selected = true;
 langSelect.appendChild(opt);
 });
}

function updateSettingAndSave(key, value) {
 settings[key] = value;
 localStorage.setItem('chatSettings', JSON.stringify(settings));
}

themeSelect.addEventListener('change', (e) => {
 updateSettingAndSave('theme', e.target.value);
 applySettings();
});

fontSelect.addEventListener('change', (e) => {
 updateSettingAndSave('fontSize', e.target.value);
 applySettings();
});

langSelect.addEventListener('change', (e) => {
 updateSettingAndSave('lang', e.target.value);
 applySettings();
});

if (toggleTopBarBtn) {
 toggleTopBarBtn.addEventListener('click', () => {
 settings.showTopBar = !settings.showTopBar;
 localStorage.setItem('chatSettings', JSON.stringify(settings));
 applySettings();
 });
}

settingsBtn.addEventListener('click', () => {
 settingsModal.classList.add('show');
});

function closeSettingsModal() {
 settingsModal.classList.add('hide');
 setTimeout(() => {
 settingsModal.classList.remove('show', 'hide');
 },300);
}

closeSettingsBtn.addEventListener('click', closeSettingsModal);

settingsModal.addEventListener('click', (e) => {
 if (e.target === settingsModal) {
 closeSettingsModal();
 }
});

applySettings();

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