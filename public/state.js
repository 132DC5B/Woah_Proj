export const state = {
 i18n: window.LANG,
 settings: JSON.parse(localStorage.getItem('chatSettings')) || {
 theme: 'dark',
 fontSize: 'medium',
 lang: 'en_GB',
 showTopBar: true
 },
 messages: [],
 socket: null,
 dom: {},
 renderMessages: null
};
