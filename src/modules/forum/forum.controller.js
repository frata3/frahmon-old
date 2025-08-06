import autoBind from "auto-bind";
import forumService from "./forum.service.js";
import { nanoid } from "nanoid";
import syncUserToAllModules from "../../common/utils/syncUser.util.js";
import generateSlug from "../../common/utils/slugify.util.js";

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
      await syncUserToAllModules(req.session.user);
      const userId = req.session.user?._id;
      const { title, content, parentId, quoteId, repostId } = req.body;
      if (!content || !content.trim()) {
        throw new Error("محتوای پست نمی‌تواند خالی باشد");
      }
      const post = await this.#service.createPost({
        id: nanoid(10),
        title: title || null,
        slug: title ? generateSlug(title) : null,
        content,
        parentId: parentId || null,
        quoteId: quoteId || null,
        repostId: repostId || null,
        userId,
      });
      const isReply = !!post.parentId;
      if (isReply) {
        return res
          .status(201)
          .json({ success: true, message: "پاسخ ارسال شد" });
      }

      res.redirect(`/forum/${post.id}/${post.slug}`);
    } catch (err) {
      console.log("have error : " + err);
      next(err);
    }
  }
  async deletePost(req, res) {
    const { id } = req.params;
    const userId = req.session.user._id;
    const post = await this.#service.getById(id);

    if (!post || post.authorId !== userId)
      return res.status(403).send("شما مجاز به حذف این پست نیستید");

    await this.#service.deleteById(id);

    return res.status(200).send("پست حذف شد");
  }
  async getPostMeta(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await this.#service.getPostMeta(postId);
      if (!post) return res.status(404).json({ error: "پست پیدا نشد" });

      res.json({
        content: post.content,
        author: {
          fullname: post.author.fullname,
          username: post.author.username,
        },
      });
    } catch (err) {
      console.error("Post Meta Error:", err);
      res.status(500).json({ error: "خطای سرور" });
    }
  }
  async getPosts(req, res, next) {
    try {
      const { cursor } = req.query;
      const userId = req.session.user?._id;

      const posts = await this.#service.getTimelinePosts(
        { cursor, take: 6 },
        userId
      );

      let nextCursor = null;
      if (posts.length === 6) {
        nextCursor = posts[5].post?.id || posts[5].reply?.id;
        posts.pop();
      }

      if (req.xhr) {
        const htmlList = await Promise.all(
          posts.map((post) => {
            return new Promise((resolve, reject) => {
              res.render(
                "pages/forum/post-item",
                { item: post, layout: false },
                (err, html) => {
                  if (err) return reject(err);
                  resolve(html);
                }
              );
            });
          })
        );

        return res.json({
          html: htmlList.join(""),
          nextCursor,
        });
      }

      // اگر صفحه اول هست
      res.addAssets({
        css: ["/assets/css/forum/index.css"],
        js: [
          { src: "/scripts/forum/main.js", type: "module", defer: true },
          { src: "/scripts/forum/lazyLoad.js", type: "module", defer: true },
        ],
      });

      res.render("pages/forum/index", {
        title: "فروم",
        posts,
        nextCursor,
      });
    } catch (err) {
      console.error("Error in forumController:", err);
      next(err);
    }
  }

  async redirectToPost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.session.user?._id;

      const post = await this.#service.getPost(id, userId);
      if (!post) return res.status(404).send("پست یافت نشد");

      if (post.slug) {
        return res.redirect(301, `/forum/${id}/${post.slug}`);
      }

      res.render("pages/forum/post", {
        title: post.title || post.content?.slice(0, 50),
        post,
      });
    } catch (err) {
      next(err);
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.session.user?._id;

      const post = await this.#service.getPost(id, userId);
      if (!post) return res.status(404).send("پست یافت نشد");
      res.addAssets({
        css: ["/assets/css/forum/post.css"],
        js: [
          "/scripts/forum/main.js",
          { src: "/scripts/forum/postPage.js", type: "module", defer: true },
        ],
      });
      res.render("pages/forum/post", {
        title: post.title || post.content?.slice(0, 50),
        post,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { postId } = req.body;
      const userId = req.session.user?._id;
      await syncUserToAllModules(req.session.user);
      const result = await this.#service.toggleLike(postId, userId);
      res.json(result);
    } catch (err) {
      console.error("Toggle like error:", err);
      next(err);
    }
  }
}

export default new ForumController();
