const chatService = require("../../chat.service");

const sendMessageHandler = (socket, io, user) => async ({ chatId, content }) => {
  try {
    const message = await chatService.createMessage({
      chatId,
      senderId: user._id,
      content,
    });

    io.to(chatId).emit("newMessage", {
      ...message.toObject(),
      chatId: message.chat._id,
    });
  } catch (err) {
    socket.emit("error", { message: "ارسال پیام ناموفق بود" });
  }
};

module.exports = { sendMessageHandler };
