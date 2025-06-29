// sendMessage.js
async function handleSendMessage(socket, io, data, user, chatService) {
  try {
    const message = await chatService.createMessage({
      chatId: data.chatId,
      senderId: user._id,
      content: data.content,
      replyTo: data.replyTo,
    });

    io.to(data.chatId).emit("newMessage", message);

    message.chat.members.forEach((memberId) => {
      io.to(memberId.toString()).emit("chatUpdated", {
        chatId: data.chatId,
        lastMessage: {
          content: message.content,
          sender: {
            _id: message.sender._id,
            username: message.sender.username,
          },
          createdAt: message.createdAt,
        },
      });
    });

  } catch (err) {
    console.error("❌ Error in handleSendMessage:", err); 
  }
}

module.exports = { handleSendMessage };
