import { fetchChatHTML } from "./api.js";
import { joinRoom, sendMessage, createPrivateChat, setupSocket } from "./socket.js";
import { renderChatPanel } from "./ui.js";

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
document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-username]");
    if (!el) return;

    const username = el.dataset.username;
    if (username) {
        console.log("[1] clicked on username:", username);
        createPrivateChat(username);
    }
});