import autoBind from 'auto-bind';
import PostService from './post.service.js';

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
        title: "بلاگ",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const { slug } = req.params;
      const post = await this.#service.getPostBySlug(slug);
      if (!post) {
        return res.status(404).send("پست مورد نظر یافت نشد.");
      }
      res.render("pages/blog/post.ejs", {
        post,
        authorName: post.author?.fullname,
        authorUsername: post.author?.username,
        title: "صفحه اصلی",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
