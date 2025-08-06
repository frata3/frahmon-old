import autoBind from 'auto-bind';
import PostService from './blog.service.js';
import generateSlug from '../../common/utils/slugify.util.js';

class PostController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = PostService; 
  }
  async showPosts(req, res, next) {
    try {
      // const userId = req.session.user._id;
      res.addAssets({
        css: ["/assets/css/blog/style.css"],
        js: [
          { src: "/scripts/blog/main.js", type: "module", defer: true },
          { src: "/scripts/lib/masonry.pkgd.min.js" }

        ]
      });
      const posts = await this.#service.getPosts();
      res.render("pages/blog/blog", {
        posts,
        title: "بلاگ",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.getPostById(id);
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
  async createPostPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/blog/create.css"],
        js: [
          { src: "/dist/create.js", type: "module" }
        ]
      });
      res.render("pages/blog/create-post", {
        title: "ساخت پست بلاگ",
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, description, content } = req.body;
      const post = await this.#service.createPost({
        title,
        slug: generateSlug(title),
        description,
        content,
        author: req.session.user._id,
        user: req.session.user
      });
      res.redirect(`/blog/${post.id}/${post.slug}`);
    } catch (err) {
      next(err);
    }
  }
  async deletePost(req, res) {
    const { id } = req.params;
    const userId = req.session.user._id;
    const post = await this.#service.getPostById(id);

    if (!post || post.author._id !== userId)
      return res.status(403).send("شما مجاز به حذف این پست نیستید");

    await this.#service.deleteById(id);
    return res.status(200).send("پست حذف شد");
  }
  async redirectToPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.getPostById(id);
    
      if (!post) return res.status(404).send("پست یافت نشد");

      return res.redirect(301, `/blog/${id}/${post.slug}`);
    } catch (err) {
      next(err);
    }
  }
}

export default new PostController();
