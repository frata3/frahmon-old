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
      res.render("pages/blog", {
        posts,
        title: "نگارستان",
        cssFile: "/blog/style.css"
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
      res.render(`pages/post.ejs`, {
        post,
        layout: `layouts/main`,
        title: "صفحه اصلی",
        cssFile: "/blog/post.css"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
