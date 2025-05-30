const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async getUserProfile(req, res, next) {
    try {
      const username = req.params.username;
      const profileData = await this.#service.findForPublic(username);

      if (!profileData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.render("./pages/user/public/publicProfile.ejs", {
        title: profileData.fullname,
        // cssFile: "/assets/css/user/account.css",
        profile: profileData,
        user: req.session.user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getUserPosts(req, res, next) {
    try {
      const username = req.params.username;
      const posts = await this.#service.findPublicPosts(username);
      console.log("test 1 : "+ posts);
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
