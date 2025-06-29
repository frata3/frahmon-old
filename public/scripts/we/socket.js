import { handleChatCreated, updateChatList, appendMessage } from "./ui.js";

export const socket = io();

export function setupSocket(currentUserId) {
  socket.on("chatCreated", handleChatCreated);

  socket.on("newMessage", (msg) => {
    console.log("[📥] New message received:", msg);
    if (msg.chat._id === window.currentChatId) {
      appendMessage(msg);
    }
    updateChatList(msg.chat._id, {
      content: msg.content,
      sender: msg.sender,
      createdAt: msg.createdAt,
    });
  });

  socket.on("chatUpdated", ({ chatId, lastMessage }) => {
    console.log("[📬] Chat list update:", chatId, lastMessage);
    updateChatList(chatId, lastMessage);
  });
}

export function joinRoom(chatId) {
  socket.emit("joinRoom", chatId);
}

export function sendMessage(chatId, content) {
  socket.emit("sendMessage", { chatId, content });
}

export function createPrivateChat(username) {
  console.log("[2] emitting createPrivateChat for", username);
  socket.emit("createPrivateChat", username);
}
