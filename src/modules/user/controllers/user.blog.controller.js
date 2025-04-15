const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async getPostsByUser(req, res, next) {
    try {
      const userId = req.session.user._id;
      const posts = await this.#service.findPosts(userId);
      console.log("test 1 : "+ posts);
      res.render("./pages/me/blog", {
        posts,
        title: "ناحیه کاربری",
        cssFile: "/assets/css/me/posts.css",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async createPostPage(req, res, next) {
    try {
      res.render("pages/me/create-post", {
        title: "ساخت پست بلاگ",
        cssFile: "/assets/css/me/create-post.css",
        userId: req.session.user._id,
        // userName: req.se
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, slug, description, content, tags } = req.body;
      if (!slug || !title || !description || !content || !tags) {
        throw new Error("تمام فیلدهای اجباری باید پر شوند!");
      }
      const postData = {
        title,
        slug,
        description,
        content,
        author: req.session.user._id,
        tags,
      };
      const newPost = await this.#service.createPost(postData);
      res.redirect("/blog/post/" + newPost.slug);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = new UserController();
