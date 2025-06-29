// src/modules/we/socket/we.socket.js
const autoBind = require("auto-bind");
const service = require("../services/we.service");
const { handleSendMessage } = require("./handlers/sendMessage");

const handleJoinRoom = require("./handlers/joinRoom");
const handleCreatePrivateChat = require("./handlers/createPrivateChat");

class ChatSocket {
  #io;
  #chatService;

  constructor(io) {
    this.#io = io;
    this.#chatService = service;
    autoBind(this);
  }

  init() {
    this.#io.on("connection", (socket) => {
      const user = socket.request.session?.user;
      console.log(`socket session connected: @${user.username}`);
      if (!user) return socket.disconnect();

      socket.join(user._id.toString());

      this.handleJoinRoom(socket, user);
      this.handleSendMessage(socket, user);
      this.handleCreatePrivateChat(socket, user);

      socket.on("disconnect", () => {
        console.log("🔌 User disconnected:", user.username);
      });
    });
  }

  handleJoinRoom(socket, user) {
    socket.on("joinRoom", (chatId) => { 
      console.log(`🔑 ${user.username} joined ${chatId}`);
      socket.join(chatId);
    });
  }
  

  handleSendMessage(socket, user) {
    socket.on("sendMessage", (data) => {
      handleSendMessage(socket, this.#io, data, user, this.#chatService);
    });
  }

  handleCreatePrivateChat(socket, user) {
    socket.on("createPrivateChat", (username) => {
      console.log("[3] Server received createPrivateChat:", username);
      handleCreatePrivateChat(socket, this.#io, username, user);
    });
  }
}

module.exports = ChatSocket;
