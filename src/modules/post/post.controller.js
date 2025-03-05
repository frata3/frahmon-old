const autoBind = require("auto-bind");
const PostService = require("./post.service");

class PostController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = PostService;
  }
  async showPosts(req, res, next) {
    try {
      const posts = await this.#service.getPosts();
      res.render("pages/blog/blog", {
        posts,
        title: "نگارستان",
        cssFile: "/assets/css/blog/style.css",
        user: req.session.user
      });
    } catch (error) {
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const { titlePath } = req.params;
      const post = await this.#service.getPostByTitlePath(titlePath);
      if (!post) {
        return res.status(404).send("پست مورد نظر یافت نشد.");
      }
      res.render(`pages/blog/post.ejs`, {
        post,
        title: "صفحه اصلی",
        cssFile: "/assets/css/blog/post.css",
        user: req.session.user

      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
