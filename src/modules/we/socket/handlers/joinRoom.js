import ChatModel from '../../models/we.model.js';

const joinRoomHandler = (socket) => async (chatId) => {
  try {
    const chat = await ChatModel.findById(chatId).select("_id");
    if (!chat) return socket.emit("error", { message: "اتاق چت پیدا نشد" });

    socket.join(chatId);
  } catch (err) {
    console.error("joinRoom error:", err);
    socket.emit("error", { message: "خطا در پیوستن به اتاق" });
  }
};

export default { joinRoomHandler };
