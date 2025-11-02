// 設置模態框控制
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('show');
});

function closeSettingsModal() {
    settingsModal.classList.add('hide');
    setTimeout(() => {
        settingsModal.classList.remove('show', 'hide');
    }, 300); // 等待動畫完成
}

closeSettingsBtn.addEventListener('click', closeSettingsModal);

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettingsModal();
    }
});
