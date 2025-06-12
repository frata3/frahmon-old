const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
const ConnectionService = require("../services/user.connection.service");
class UserController {
  #userService;
  #connectionService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
    this.#connectionService = ConnectionService;
  }
  async getUserProfile(req, res, next) {
    try {
      const username = req.params.username;
      const userData = await this.#userService.findForPublic(username);
      const currentUserId = req.session.user?._id;
      if (!userData)
        return res.render("./errors/user-not-found.ejs", { title: "کاربر یافت نشد" });

      const followersCount = await this.#connectionService.countDocuments({
        target: userData.userId,
        type: "follow",
        status: "active",
      });
      let isFollowing = false;
      if (currentUserId) {
        const connection = await this.#connectionService.findOne({
          source: currentUserId,
          target: userData.userId,
          type: "follow",
          status: "active",
        });
        isFollowing = !!connection;
      }

      res.render("./pages/user/public/publicProfile.ejs", {
        title: userData.fullname,
        targetUser: userData,
        user: req.session.user,
        followersCount,
        isFollowing,
        isMe: currentUserId?.toString() === userData.userId.toString(),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
      next(err);
    }
  }
  async getUserPosts(req, res, next) {
    try {
      const username = req.params.username;
      const posts = await this.#userService.findPublicPosts(username);
      res.render("./pages/user/me/blog", {
        posts,
        title: username,
        cssFile: "/assets/css/user/posts.css",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
