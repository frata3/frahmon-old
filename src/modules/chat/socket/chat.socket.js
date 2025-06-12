// chat/socket/chat.socket.js
const handleSendMessage = require("./handlers/sendMessage");
const handleJoinRoom = require("./handlers/joinRoom");
const handleCreatePrivateChat = require("./handlers/createPrivateChat");

module.exports = function (io) {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    const user = socket.request.session.user;
    if (!user) {
      socket.disconnect();
      return;
    }

    console.log("User connected to /chat:", user.username);

    handleSendMessage(socket, chatNamespace);
    handleJoinRoom(socket, chatNamespace);
    handleCreatePrivateChat(socket, chatNamespace);

    socket.on("disconnect", () => {
      console.log("User disconnected:", user.username);
    });
  });
};
