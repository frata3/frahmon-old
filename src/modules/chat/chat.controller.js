const autoBind = require("auto-bind");
const service = require("./chat.service");
const UserService = require("../user/services/user.service");
class UserController {
  #service;
  #userService;
  constructor() {
    autoBind(this);
    this.#service = service;
    this.#userService = UserService;
  }
  async chatHome(req, res, next) {
    try {
      const userId = req.session.user._id;
      const chats = await this.#service.getUserChats(userId);
      const queryUsername = req.query.to;
      const toUsername = await this.#userService.findOne({
        username: queryUsername,
      });

      res.render("pages/chat/home", {
        user: req.session.user,
        title: "گفت‌وگوها",
        chats,
        currentUserId: userId,
        toUsername: queryUsername !== undefined ? toUsername?.username : "  ",
      });
    } catch (err) {
      console.log("controller error chatHome : " + err);
      next(err);
    }
  }
  async getChatRoomPartial(req, res, next) {
    try {
      const currentUserId = req.session.user._id;
      const username = req.params.username;
      const targetUser = await this.#userService.findOne({ username });
      if (!targetUser)
        return res.status(404).json({ html: "کاربر یافت نشد", exists: false });

      const chat = await this.#service.getPrivateChat(
        currentUserId,
        targetUser._id
      );

      // if (!chat) return res.json({ html: "هنوز گفت‌وگویی وجود ندارد.", exists: false });

      const messages = await this.#service.getChatMessages(chat?._id);
      res.render(
        "pages/chat/partials/chat-box",
        {
          layout: false,
          chatId: chat?._id,
          chatName: targetUser.username,
          messages: messages.reverse(),
          currentUserId,
          targetUser,
        },
        (err, html) => {
          if (err) return next(err);
          res.json({ html, exists: true });
        }
      );
    } catch (err) {
      console.log("controller error getChatRoomPartial : " + err);
      next(err);
    }
  }
  async createPrivateChatIfNotExist(req, res, next) {
    try {
      const currentUser = req.session.user;
      const currentUserId = currentUser._id;
      const { username } = req.body;

      const targetUser = await this.#userService.findOne({ username });
      if (!targetUser) return res.status(404).json({});

      const existingChat = await this.#service.getPrivateChat(
        currentUserId,
        targetUser._id
      );
      if (existingChat) return res.json({ chatId: existingChat._id });

      const newChat = await this.#service.createPrivateChat(
        currentUserId,
        targetUser._id
      );

      const io = req.app.get("io");

      const defaultMessage = {
        content: "شروع گفتگو",
        createdAt: new Date(),
      };

      io.to(currentUserId.toString()).emit("chatCreated", {
        chatId: newChat._id,
        otherUser: {
          _id: targetUser._id,
          username: targetUser.username,
          fullname: targetUser.fullname,
        },
        lastMessage: defaultMessage,
      });

      io.to(targetUser._id.toString()).emit("chatCreated", {
        chatId: newChat._id,
        otherUser: {
          _id: currentUserId,
          username: currentUser.username,
          fullname: currentUser.fullname,
        },
        lastMessage: defaultMessage,
      });

      res.json({ chatId: newChat._id });
    } catch (err) {
      console.log("خطا در ساخت چت:", err);
      next(err);
    }
  }
}

module.exports = new UserController();
