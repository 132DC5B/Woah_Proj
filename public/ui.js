import { state } from './state.js';

export function cacheDom() {
 state.dom = {
 chatDiv: document.getElementById('chat'),
 msgInput: document.getElementById('msg'),
 sendBtn: document.getElementById('sendBtn'),
 keyInput: document.getElementById('key'),
 userInput: document.getElementById('user'),
 loadBtn: document.getElementById('loadBtn'),
 settingsBtn: document.getElementById('settingsBtn'),
 settingsModal: document.getElementById('settingsModal'),
 closeSettingsBtn: document.getElementById('closeSettingsBtn'),
 themeSelect: document.getElementById('themeSelect'),
 fontSelect: document.getElementById('fontSelect'),
 langSelect: document.getElementById('langSelect'),
 clearKeyBtn: document.getElementById('clearKeyBtn'),
 toggleTopBarBtn: document.getElementById('toggleTopBarBtn')
 };
}

export function bindUIActions() {
 const s = state;
 const d = s.dom;
 d.themeSelect.addEventListener('change', (e) => { s.settings.theme = e.target.value; localStorage.setItem('chatSettings', JSON.stringify(s.settings)); applySettings(); });
 d.fontSelect.addEventListener('change', (e) => { s.settings.fontSize = e.target.value; localStorage.setItem('chatSettings', JSON.stringify(s.settings)); applySettings(); });
 d.langSelect.addEventListener('change', (e) => { s.settings.lang = e.target.value; localStorage.setItem('chatSettings', JSON.stringify(s.settings)); applySettings(); });
 if (d.toggleTopBarBtn) d.toggleTopBarBtn.addEventListener('click', () => { s.settings.showTopBar = !s.settings.showTopBar; localStorage.setItem('chatSettings', JSON.stringify(s.settings)); applySettings(); });
 d.settingsBtn.addEventListener('click', () => d.settingsModal.classList.add('show'));
 d.closeSettingsBtn.addEventListener('click', closeSettingsModal);
 d.settingsModal.addEventListener('click', (e) => { if (e.target === d.settingsModal) closeSettingsModal(); });
 d.clearKeyBtn.addEventListener('click', () => { d.keyInput.value = ''; state.renderMessages(); });
 d.loadBtn.addEventListener('click', async () => { const res = await fetch('/messages'); const data = await res.json(); state.messages = data.messages; state.renderMessages(); });
 d.msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); d.sendBtn.click(); } });
 d.sendBtn.addEventListener('click', () => sendMessage());
 d.keyInput.addEventListener('input', () => state.renderMessages());
}

export function closeSettingsModal() {
 const d = state.dom;
 d.settingsModal.classList.add('hide');
 setTimeout(() => { d.settingsModal.classList.remove('show', 'hide'); },300);
}
