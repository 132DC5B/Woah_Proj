// 多語言字典（由 lang.js 提供）
const i18n = window.LANG;

// 加載保存的設置
let settings = JSON.parse(localStorage.getItem('chatSettings')) || {
  theme: 'dark',
  fontSize: 'medium',
  lang: 'en_GB',
  showTopBar: true
};

// 應用設置
function applySettings() {
  // 主題設置
  document.body.className = settings.theme;

  // 字體大小
  // 字體大小：使用 body class 以便廣泛覆蓋 UI 元素
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  const fontClass = { small: 'font-small', medium: 'font-medium', large: 'font-large' }[settings.fontSize] || 'font-medium';
  document.body.classList.add(fontClass);

  // 更新選擇框
  themeSelect.value = settings.theme;
  fontSelect.value = settings.fontSize;
  langSelect.value = settings.lang;

  // top bar visibility
  const topBar = document.querySelector('.top-bar');
  if (settings.showTopBar) topBar.classList.remove('collapsed'); else topBar.classList.add('collapsed');

  // 全局語言
  document.documentElement.lang = settings.lang;

  // 多語言 UI
  const lang = settings.lang;
  // 標題、副標題
  document.querySelector('h2').textContent = i18n[lang].title;
  document.querySelector('h3').textContent = i18n[lang].subtitle;
  // 輸入框
  userInput.placeholder = i18n[lang].userPlaceholder;
  keyInput.placeholder = i18n[lang].keyPlaceholder;
  msgInput.placeholder = i18n[lang].msgPlaceholder;
  // 按鈕
  sendBtn.textContent = i18n[lang].send;
  loadBtn.textContent = i18n[lang].load;
  clearKeyBtn.textContent = i18n[lang].clearKey;

  // 設定視窗
  document.querySelector('.modal-content h4').textContent = i18n[lang].settings;
  document.querySelector('label[for="themeSelect"]').textContent = i18n[lang].theme;
  document.querySelector('label[for="fontSelect"]').textContent = i18n[lang].fontSize;
  document.getElementById('labelLang').textContent = i18n[lang].lang;
  closeSettingsBtn.textContent = i18n[lang].close;
  // 下拉選單內容（動態依據 lang.js）
  themeSelect.options[0].text = i18n[lang].dark;
  themeSelect.options[1].text = i18n[lang].light;
  fontSelect.options[0].text = i18n[lang].small;
  fontSelect.options[1].text = i18n[lang].medium;
  fontSelect.options[2].text = i18n[lang].large;

  // 重新生成語言下拉（依 window.LANG 的 keys）
  // 保留目前語言選取
  const currentLang = settings.lang;
  langSelect.innerHTML = '';
  Object.keys(window.LANG).forEach((code) => {
    const opt = document.createElement('option');
    opt.value = code;
    // 顯示名稱從當前語言的字串取，若缺則 fallback to code
    opt.text = (i18n[currentLang] && i18n[currentLang][code]) || code;
    if (code === currentLang) opt.selected = true;
    langSelect.appendChild(opt);
  });
}

// 監聽設置變更
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

// 初始應用設置
applySettings();
