import autoBind from 'auto-bind';
import service from '../services/we.service.js';
import UserService from '../../user/services/user.service.js';
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

      res.render("pages/we/home", {
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
        "pages/we/partials/chat-box",
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
  
}

export default new UserController();
