const autoBind = require("auto-bind");
const forumService = require("../services/forum.thread.service");
class ForumController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = forumService;
  }
  async createPostPage(req, res, next) { 
    try {
      res.render("pages/forum/create", {
        title: "فروم"
      });
    } catch (err) {
      next(err);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const authorId = req.session.user._id;
      const post = await this.#service.createPost({ title, content, userInfo: req.session.user });
      res.status(201).json(post);
    } catch (err) {
      console.error("have error : "+ err);
      next(err);
    }
  }
  async getPosts(req, res, next) { 
    try {
      const posts = await this.#service.getAllPosts();

      res.render("pages/forum/index", {
        title: "فروم",
        posts,
        user: req.session.user?.username
      });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ForumController();
