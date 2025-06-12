const autoBind = require("auto-bind");
const service = require("./chat.service");

class ChatSocket {
  #io;
  #chatService;

  constructor(io) {
    autoBind(this);
    this.#io = io;
    this.#chatService = service;
  }

  init() {
    this.#io.on("connection", (socket) => {
      console.log("🔌 New connection");

      const user = socket.request.session?.user;
      if (!user) return socket.disconnect();
      
      socket.join(user._id.toString());

      socket.on("joinRoom", (chatId,chatName) => { 
        console.log(`🔑 User ${user.username} joined chat with ${chatName}`);
        socket.join(chatId);
      });
      socket.on("createPrivateChat", (username) =>
        this.handleCreatePrivateChat(socket, username, user)
      );
      
      socket.on("sendMessage", (data) =>
        this.handleSendMessage(socket, data, user)
      );
    });
  }

  async handleSendMessage(socket, { chatId, content }, user) {
    try {
      const message = await this.#chatService.createMessage({
        chatId,
        senderId: user._id,
        content,
      });
      this.#io.to(chatId).emit("newMessage", {
        ...message.toObject(),
        chatId: message.chat._id,
      });
      
    } catch (err) {
      console.error("❌ Message error:", err.message);
      socket.emit("error", { message: "ارسال پیام ناموفق بود" });
    }
  }
  async handleCreatePrivateChat(socket, targetUsername, currentUser) {
    try {
      const targetUser = await this.#chatService.findUserByUsername(targetUsername);
      if (!targetUser) {
        return socket.emit("error", { message: "کاربر پیدا نشد" });
      }
  
      const currentUserId = currentUser._id;
      const existingChat = await this.#chatService.getPrivateChat(
        currentUserId,
        targetUser._id
      );
      if (existingChat) {
        socket.emit("chatCreated", {
          chatId: existingChat._id,
          otherUser: {
            _id: targetUser._id,
            username: targetUser.username,
            fullname: targetUser.fullname,
          },
          lastMessage: await this.#chatService.getLastMessage(existingChat._id),
        });
        return;
      }
  
      const newChat = await this.#chatService.createPrivateChat(
        currentUserId,
        targetUser._id
      );
  
      const defaultMessage = {
        content: "شروع گفتگو",
        createdAt: new Date(),
      };
  
      this.#io.to(currentUserId.toString()).emit("chatCreated", {
        chatId: newChat._id,
        otherUser: {
          _id: targetUser._id,
          username: targetUser.username,
          fullname: targetUser.fullname,
        },
        lastMessage: defaultMessage,
      });
  
      this.#io.to(targetUser._id.toString()).emit("chatCreated", {
        chatId: newChat._id,
        otherUser: {
          _id: currentUserId,
          username: currentUser.username,
          fullname: currentUser.fullname,
        },
        lastMessage: defaultMessage,
      });
  
      socket.emit("chatCreated", {
        chatId: newChat._id,
        otherUser: {
          _id: targetUser._id,
          username: targetUser.username,
          fullname: targetUser.fullname,
        },
        lastMessage: defaultMessage,
      });
  
    } catch (err) {
      console.error("❌ createPrivateChat:", err.message);
      socket.emit("error", { message: "ایجاد چت ناموفق بود" });
    }
  }
  
  
}

module.exports = ChatSocket;

// const ip = socket.handshake.address;
//     const userAgent = socket.handshake.headers['user-agent'];
//     console.log("🔌 New socket connected");
//     console.log("🔌 Connected from:", socket.handshake.headers.referer);
//     console.log("📍 IP:", ip);
//     console.log("🧭 User-Agent:", userAgent);
//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });
