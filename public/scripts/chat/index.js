const { fetchChatHTML } = require("./api.js");
const { joinRoom, sendMessage, createPrivateChat, setupSocket } = require("./socket.js");
const { renderChatPanel } = require("./ui.js");

document.addEventListener("DOMContentLoaded", async () => {
    const username = window.toUsername;
    setupSocket(window.currentUserId);

    if (username?.length > 2) {
        const { html, exists } = await fetchChatHTML(username);
        renderChatPanel(html);
        if (exists) {
            window.currentChatId = document.getElementById("chat-box").dataset.chatId;
            joinRoom(window.currentChatId);
        }
    }
});