import autoBind from 'auto-bind';
import ContentService from '../services/content.service.js';

class ContentController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = ContentService;
  }
  async getExplore(req, res, next) {
    try {
      const categories = await this.#service.exploreCategories();
      const categoriesWithTopics = await Promise.all(
        categories.map(async (category) => {
          const topics = await this.#service.exploreTopics({
            categories: category._id,
          });
          return { ...category, topics };
        })
      );
      res.render("./pages/content/explore", {
        title: "کاوش در فهرست",
        categories: categoriesWithTopics,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategory(req, res, next) {
    try {
      const { categorySlug } = req.params;
      const category = await this.#service.findCategory({ slug: categorySlug });
      if (!category) {
        return res
          .status(404)
          .render("errors/404", { title: "دسته‌بندی پیدا نشد" });
      }

      const topics = await this.#service.findTopics({ categories: category._id });
      res.render("pages/content/category", {
        title: category.name,
        category,
        topics,
      });
    } catch (error) {
      next(error);
    }
  }
  async getTopic(req, res, next) {
    try {
      const { topicSlug } = req.params;
      const topic = await this.#service.findTopic({ slug: topicSlug });
      if (!topic) {
        return res
          .status(404)
          .render("errors/404", { title: "شاخه پیدا نشد" });
      }

      const tags = await this.#service.findTags({ topics: topic._id });
      res.render("pages/content/topic", {
        title: topic.name,
        topic,
        tags,
      });
    } catch (error) {
      next(error);
    }
  }
  async getTagContents(req, res, next) {
    try {
      const { tagSlug } = req.params;
      const data = await this.#service.getContentsByTag(tagSlug);
      if (!data) {
        return res
          .status(404)
          .render("errors/404", { title: "برچسب پیدا نشد" });
      }

      res.render("pages/content/tag", {
        title: `برچسب: ${data.tag.name}`,
        tag: data.tag,
        posts: data.posts,
        // storeProducts: data.storeProducts,
        // forumPosts: data.forumPosts,
      });
    } catch (error) {
      next(error);
    }
  }
  async searchCategories(req, res) {
    try {
      const { query } = req.query;
      if (!query) return res.json([]);

      const categories = await this.#service.searchCategories(query);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت موضوعات" });
    }
  }
  async searchTopics(req, res) {
    try {
      const { query, categoryId } = req.query;

      if (!query || !categoryId) return res.json([]);

      const topics = await this.#service.searchTopics(query, categoryId);

      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت موضوعات" });
    }
  }
  async searchTags(req, res) {
    try {
      const { query, topicId } = req.query;
      if (!query || !topicId) return res.json([]);

      const tags = await this.#service.searchTags(query, topicId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت تگ‌ها" });
    }
  }
}

export default new ContentController();
