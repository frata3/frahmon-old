document.addEventListener("DOMContentLoaded", async () => {
  const socket = io();
  let activeChatId = null;
  const toUsername = window.toUsername || "";
  const loadChatBox = async (username) => {
    try {
      const res = await axios.get(`/chat/${username}`);
      const panel = document.getElementById("chat-panel");
      panel.innerHTML = res.data.html;
      const chatBox = document.getElementById("chat-box");
      const chatId = chatBox.dataset.chatId;
      activeChatId = chatId;
      socket.emit("joinRoom", chatId);
      const form = document.getElementById("message-form");
      const input = document.getElementById("messageInput");
      form.onsubmit = (e) => {
        e.preventDefault();
        const content = input.value;
        if (!content.trim()) return;
        socket.emit("sendMessage", { chatId, content });
        input.value = "";
      };
    } catch (err) {
      console.error("خطا در بارگذاری چت:", err);
    }
  };
  if (toUsername) {
    await loadChatBox(toUsername);
  }
  socket.on("newMessage", (message) => {
    if (message.chatId !== activeChatId) return;
    const messages = document.getElementById("messages");
    if (messages) {
      const div = document.createElement("div");
      const isSent =
        String(message.sender._id) === String(window.currentUserId);
      div.className = "message " + (isSent ? "sent" : "received");
      div.innerText = message.content;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
  });
  document.querySelectorAll(".chat-user").forEach((el) => {
    el.addEventListener("click", async (e) => {
      const chatUser = e.target.closest(".chat-user");
      if (!chatUser) return;
      document
        .querySelectorAll(".chat-user")
        .forEach((el) => el.classList.remove("active"));
      chatUser.classList.add("active");
      const username = chatUser.dataset.username;
      if (!username) return;
      await loadChatBox(username);
    });
  });
});
