import chatService from '../../services/we.service.js';

async function handleCreatePrivateChat(socket, io, username, user) {
  try {
    const otherUser = await chatService.findUserByUsername(username);

    if (!otherUser) return socket.emit("error", { message: "کاربر یافت نشد" });

    let chat = await chatService.getPrivateChat(user._id, otherUser._id);

    if (!chat) {
      chat = await chatService.createPrivateChat(user._id, otherUser._id);
    }

    const lastMessage = await chatService.getLastMessage(chat._id);

    socket.emit("chatCreated", {
      chatId: chat._id,
      otherUser: {
        _id: otherUser._id,
        username: otherUser.username,
        fullname: otherUser.fullname,
      },
      lastMessage,
    });
    console.log("[5] Emitting chatCreated to client"); // ✅ اینجا
  } catch (err) {
    console.error("createPrivateChat error:", err);
    socket.emit("error", { message: "خطا در ایجاد گفتگو" });
  }
}

export default handleCreatePrivateChat;

// module.exports = async function handleCreatePrivateChat(socket, io, username, user) {
//   console.log("[4] Handling private chat creation for:", username); // ✅ اینجا

//   // بعد از پیدا کردن چت و ارسال به کاربر:
//   socket.emit("chatCreated", {
//     chatId: chat._id,
//     otherUser: otherUser, // یا { username: otherUser.username } بسته به پیاده‌سازی
//   });
//   console.log("[5] Emitting chatCreated to client"); // ✅ اینجا
// };
