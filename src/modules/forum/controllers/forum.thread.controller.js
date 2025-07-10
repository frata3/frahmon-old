import autoBind from "auto-bind";
import forumService from "../services/forum.thread.service.js";
import { nanoid } from "nanoid";
import syncUserToAllModules from "../../../common/utils/syncUser.util.js";

class ForumController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = forumService;
  }
  async createPostPage(req, res, next) {
    try {
      const { parentId, quoteId, repostId } = req.query;
      res.render("pages/forum/create", {
        title: "پست جدید",
        parentId: parentId || null,
        quoteId: quoteId || null,
        repostId: repostId || null,
      });
    } catch (err) {
      console.error("render create form error: ", err);
      next(err);
    }
  }
  async createPost(req, res, next) {
    try {
      await syncUserToAllModules(req.session.user)

      const { title, content, parentId, quoteId, repostId } = req.body;
      const post = await this.#service.createPost({
        id: nanoid(10),
        title,
        content,
        parentId: parentId || null,
        quoteId: quoteId || null,
        repostId: repostId || null,
        userId: req.session.user._id,
      });
      const isReply = !!post.parentId;
      if (isReply) {
        res.status(201).json(post)
      }
      res.redirect(`/forum/${post.id}/${post.slug}`);
    } catch (err) {
      console.error("have error : " + err);
      next(err);
    }
  }
  async toggleLike(req, res, next) {
    try {
      const { postId } = req.body;
      const userId = req.session.user._id;
      await syncUserToAllModules(req.session.user)
      const result = await this.#service.toggleLike(postId, userId);
      res.json(result);
    } catch (err) {
      console.error("Toggle like error:", err);
      next(err);
    }
  }
  
  
  async getPosts(req, res, next) {
    try {
      const posts = await this.#service.getAllPosts();
      res.render("pages/forum/index", {
        title: "فروم",
        posts,
        user: req.session.user?.username,
      });
    } catch (err) {
      next(err);
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.getPost(id);
      if (!post) {
        return res.status(404).send("پست مورد نظر یافت نشد.");
      }
      res.render("pages/forum/post.ejs", {
        post,
        title: "صفحه اصلی",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ForumController();
