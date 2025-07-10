import autoBind from 'auto-bind';
import service from './chat.service.js';

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
   
  
  
}

export default ChatSocket;

// const ip = socket.handshake.address;
//     const userAgent = socket.handshake.headers['user-agent'];
//     console.log("🔌 New socket connected");
//     console.log("🔌 Connected from:", socket.handshake.headers.referer);
//     console.log("📍 IP:", ip);
//     console.log("🧭 User-Agent:", userAgent);
//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });
