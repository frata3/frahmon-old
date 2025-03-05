const autoBind = require("auto-bind");
const ContentService = require("../services/content.service");

class PostController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = ContentService;
  }

  async getContents(req, res) {
    try {
      const { categorySlug } = req.params;
      const category = await this.#service.findCategory({ slug: categorySlug });
      if (!category) return res.status(404).send("دسته‌بندی یافت نشد!");

      const topic = await this.#service.findTopic({slug: topicSlug});
      if (!topic) return res.status(404).send("موضوع یافت نشد!");

      const tag = await this.#service.findTag({ slug: tagSlug });
      if (!tag) return res.status(404).send("تگ یافت نشد!");

      res.render("category", {
        category,
        topics,
        products,
        posts,
        forumThreads,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("خطای سرور");
    }
  }
}

module.exports = new PostController();
