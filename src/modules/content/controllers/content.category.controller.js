const autoBind = require("auto-bind");
const ContentService = require("../services/content.service");

class PostController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = ContentService;
  }

  async getCategoryTopics(req, res) {
    try {
        const { categorySlug } = req.params;
        const category = await this.#service.findCategory({ slug: categorySlug });
        if (!category) {
            return res.status(404).send("دسته‌بندی پیدا نشد");
        }
        const topics = await topicService.findTopics({ category: category._id });
        res.render("/pages/content/category", { category, topics });
    } catch (error) {
        console.error(error);
        res.status(500).send("خطای سرور");
    }
}

}

module.exports = new PostController();
