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
        toggleTopBarBtn: document.getElementById('toggleTopBarBtn'),
        githubBtn: document.getElementById('githubBtn')
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

    if (d.githubBtn) {
        d.githubBtn.addEventListener('click', (e) => {
            const url = d.githubBtn.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank', 'noopener');
            }
        });
    }
}

export function closeSettingsModal() {
    const d = state.dom;
    d.settingsModal.classList.add('hide');
    setTimeout(() => { d.settingsModal.classList.remove('show', 'hide'); }, 300);
}

// Apply settings to the UI: theme, font size, show/hide top bar, and sync selects
export function applySettings() {
    const s = state;
    const d = s.dom || {};

    // Theme
    if (s.settings.theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }

    // Font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    const fs = s.settings.fontSize || 'medium';
    document.body.classList.add(`font-${fs}`);

    // Show/hide top bar
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        if (s.settings.showTopBar === false) {
            topBar.classList.add('collapsed');
        } else {
            topBar.classList.remove('collapsed');
        }
    }

    // Sync selects and toggle button state if DOM cached
    if (d.themeSelect) d.themeSelect.value = s.settings.theme || 'dark';
    if (d.fontSelect) d.fontSelect.value = s.settings.fontSize || 'medium';
    if (d.langSelect) d.langSelect.value = s.settings.lang || 'en_GB';

    // Optionally re-render messages to apply theme to message styles
    if (typeof state.renderMessages === 'function') state.renderMessages();
}
