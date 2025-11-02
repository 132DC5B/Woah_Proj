// top bar toggle
if (toggleTopBarBtn) {
    toggleTopBarBtn.addEventListener('click', () => {
        settings.showTopBar = !settings.showTopBar;
        localStorage.setItem('chatSettings', JSON.stringify(settings));
        applySettings();
    });
}
