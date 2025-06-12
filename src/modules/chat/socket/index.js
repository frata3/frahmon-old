const autoBind = require("auto-bind");
const { joinRoomHandler } = require("./handlers/joinRoom");
const { sendMessageHandler } = require("./handlers/socket.sendMessage");
const { createPrivateChatHandler } = require("./handlers/createPrivateChat");

class ChatSocket {
  constructor(io) {
    autoBind(this);
    this.io = io;
  }

  init() {
    this.io.on("connection", (socket) => {
      const user = socket.request.session?.user;
      if (!user) return socket.disconnect();

      socket.join(user._id.toString());

      socket.on("joinRoom", joinRoomHandler(socket));
      socket.on("sendMessage", sendMessageHandler(socket, this.io, user));
      socket.on("createPrivateChat", createPrivateChatHandler(socket, this.io, user));
    });
  }
}

module.exports = ChatSocket;
