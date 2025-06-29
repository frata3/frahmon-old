import { socket, joinRoom } from "./socket.js";
import { fetchChatHTML } from "./api.js";

export function renderChatPanel(html) {
  document.getElementById("chat-panel").innerHTML = html;
  console.log("[9] Rendering chat panel");

  const form = document.getElementById("message-form");
  const input = document.getElementById("messageInput");

  const messages = document.getElementById("messages");
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
  }

  if (!form || !input) {
    console.warn("⛔ message-form or messageInput not found");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = input.value;
    if (!content.trim()) return;

    console.log("[1] Form submission intercepted");
    console.log("[2] Sending message:", content);
    const chatId = window.currentChatId;
    if (!chatId) {
      console.warn("⛔ No chatId found in window.currentChatId");
      return;
    }

    socket.emit("sendMessage", { chatId, content });
    input.value = "";
  });
}


export async function handleChatCreated({ chatId, otherUser }) {
  console.log("[7] Handling chatCreated:", chatId, otherUser.username);
  
  const { html } = await fetchChatHTML(otherUser.username);
  console.log("[8] Received HTML for chat:", html?.slice(0, 50));

  renderChatPanel(html);

  const chatBox = document.getElementById("chat-box");
  const newChatId = chatBox?.dataset.chatId;

  console.log("[8.5] Fetched chatId from DOM:", newChatId);

  if (newChatId) {
    window.currentChatId = newChatId;
    joinRoom(newChatId);
  } else {
    console.warn("⚠️ chat-box or data-chat-id not found!");
  }
}

export async function appendMessage(msg) {
  const box = document.getElementById("messages");
  if (!box) {
    console.warn("⛔ Message box not found");
    return;
  }

  const div = document.createElement("div");
  const isMe = msg.sender._id === window.currentUserId;
  div.className = "message " + (isMe ? "sent" : "received");
  div.innerHTML = msg.content;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

export async function updateChatList(chatId, lastMessage) {
  const el = document.querySelector(`[data-chat-id="${chatId}"]`);
  if (!el) {
    console.warn("⛔ Chat item not found in sidebar for:", chatId);
    return;
  }

  const preview = el.querySelector(".chat-last-message");
  const time = el.querySelector(".chat-last-time");

  if (preview) preview.textContent = lastMessage.content;
  if (time) {
    const date = new Date(lastMessage.createdAt);
    time.textContent = date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  el.parentNode.prepend(el);
}
