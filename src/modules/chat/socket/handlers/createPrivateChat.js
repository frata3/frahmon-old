const UserModel = require("../../../user/user.model");
const ChatModel = require("../../chat.model");
const chatService = require("../../chat.service");

const createPrivateChatHandler = (socket, io, currentUser) => async (targetUsername) => {
  try {
    const targetUser = await UserModel.findOne({ username: targetUsername }).select("_id username");
    if (!targetUser) return socket.emit("error", { message: "کاربر مورد نظر یافت نشد" });

    // بررسی چت خصوصی قبلی
    const existing = await ChatModel.findOne({
      type: "private",
      members: { $all: [targetUser._id, currentUser._id], $size: 2 },
    });

    if (existing) {
      socket.emit("chatCreated", { chatId: existing._id, exists: true });
      return;
    }

    const newChat = await chatService.createPrivateChat(currentUser._id, targetUser._id);

    socket.emit("chatCreated", { chatId: newChat._id, exists: false });
    io.to(targetUser._id.toString()).emit("chatCreated", {
      chatId: newChat._id,
      exists: false,
    });
  } catch (err) {
    console.error("createPrivateChat error:", err);
    socket.emit("error", { message: "ایجاد چت خصوصی ناموفق بود" });
  }
};

module.exports = { createPrivateChatHandler };
