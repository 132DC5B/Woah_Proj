import { state } from './state.js';
import { cacheDom, bindUIActions, closeSettingsModal } from './ui.js';
import { applyI18n } from './i18n.js';
import { sendMessage, renderMessages } from './crypto.js';

state.socket = io();

cacheDom();
state.renderMessages = renderMessages;

bindUIActions();
applyI18n();

state.socket.on('chat message', (encryptedMsg) => {
 state.messages.push(encryptedMsg);
 state.renderMessages();
});

// expose sendMessage for ui module
window.sendMessage = sendMessage;
