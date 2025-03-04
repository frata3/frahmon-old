const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async createPostPage(req, res, next) {
    try {
      res.render("pages/user/create-post", {
        title: "ساخت پست بلاگ",
        cssFile: "/assets/css/user/create-post.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, titlePath, description, content, author } = req.body;
      console.log(req.body);
      if (!titlePath || !title || !description || !content || !author) {
        throw new Error("تمام فیلدهای اجباری باید پر شوند!");
      }
      const postData = {
        title,
        titlePath,
        description,
        content,
        author,
      };

      await this.#service.createPost(postData);
      res.redirect("/user");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
