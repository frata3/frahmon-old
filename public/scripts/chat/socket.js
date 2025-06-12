const socket = io();

export function setupSocket(currentUserId) {
  socket.on("newMessage", (msg) => {
    if (msg.chatId !== window.currentChatId) return;
    appendMessage(msg); // تعریف در ui.js
  });

  socket.on("chatCreated", handleChatCreated); // تعریف در ui.js
}

export function joinRoom(chatId) {
  socket.emit("joinRoom", chatId);
}

export function sendMessage(chatId, content) {
  socket.emit("sendMessage", { chatId, content });
}

export function createPrivateChat(username) {
  socket.emit("createPrivateChat", username);
  socket.once("chatCreated", handleChatCreated);
}
