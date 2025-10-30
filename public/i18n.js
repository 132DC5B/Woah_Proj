import { state } from './state.js';

export function applyI18n() {
    const s = state;
    const i18n = s.i18n;
    const lang = s.settings.lang;
    document.documentElement.lang = lang;
    document.querySelector('h2').textContent = i18n[lang].title;
    document.querySelector('h3').textContent = i18n[lang].subtitle;
    const d = s.dom;
    d.userInput.placeholder = i18n[lang].userPlaceholder;
    d.keyInput.placeholder = i18n[lang].keyPlaceholder;
    d.msgInput.placeholder = i18n[lang].msgPlaceholder;
    d.sendBtn.textContent = i18n[lang].send;
    d.loadBtn.textContent = i18n[lang].load;
    d.clearKeyBtn.textContent = i18n[lang].clearKey;
    document.querySelector('.modal-content h4').textContent = i18n[lang].settings;
    document.querySelector('label[for="themeSelect"]').textContent = i18n[lang].theme;
    document.querySelector('label[for="fontSelect"]').textContent = i18n[lang].fontSize;
    document.getElementById('labelLang').textContent = i18n[lang].lang;
    d.closeSettingsBtn.textContent = i18n[lang].close;
    d.themeSelect.options[0].text = i18n[lang].dark;
    d.themeSelect.options[1].text = i18n[lang].light;
    d.fontSelect.options[0].text = i18n[lang].small;
    d.fontSelect.options[1].text = i18n[lang].medium;
    d.fontSelect.options[2].text = i18n[lang].large;
    const currentLang = s.settings.lang;
    d.langSelect.innerHTML = '';
    Object.keys(window.LANG).forEach((code) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.text = (i18n[currentLang] && i18n[currentLang][code]) || code;
        if (code === currentLang) opt.selected = true;
        d.langSelect.appendChild(opt);
    });
}
