import autoBind from 'auto-bind';
import UserService from '../services/user.service.js';
import ContentService from '../../content/services/content.service.js';
class UserController {
  #userService;
  #contentService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
    this.#contentService = ContentService;
  }
  async getContentPage(req, res, next) {
    try {
      const { categories, topics, tags } = await this.#contentService.getRawCategoryData();
  
      const categoryTree = categories.map((category) => {
        const catTopics = topics.filter((t) =>
          t.categories.some((c) => c.toString() === category._id.toString())
        );
  
        const topicsWithTags = catTopics.map((topic) => {
          const topicTags = tags.filter((tag) =>
            tag.topics.some((t) => t.toString() === topic._id.toString())
          );
          return { ...topic, tags: topicTags };
        });
  
        return { ...category, topics: topicsWithTags };
      });
  
      res.render("./pages/user/me/content", {
        title: "مدیریت محتوا",
        categories: categoryTree,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  }
  async renderCreateContentForm(req, res, next) {
    try {
      const categories = await this.#contentService.findCategories({});
      const topics = await this.#contentService.findTopics({});
      res.render("pages/user/me/create-content", {
        categories,
        topics,
        title: "ایجاد دسته‌بندی جدید",
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  }
  
  async createCategory(req, res, next) {
    try {
      const { name, slug, description } = req.body;
      await this.#contentService.createCategories({ name, slug, description });
      res.redirect("/me/content/create");
    } catch (err) {
      next(err);
    }
  }
  
  async createTopic(req, res, next) {
    try {
      const { name, slug, description, categoryIds } = req.body;
      await this.#contentService.createTopics({
        name,
        slug,
        description,
        categories: Array.isArray(categoryIds) ? categoryIds : [categoryIds],
      });
      res.redirect("/me/content/create");
    } catch (err) {
      next(err);
    }
  }
  
  async createTag(req, res, next) {
    try {
      const { name, slug, topicIds } = req.body;
      await this.#contentService.createTags({
        name,
        slug,
        topics: Array.isArray(topicIds) ? topicIds : [topicIds],
      });
      res.redirect("/me/content/create");
    } catch (err) {
      next(err);
    }
  }
  
}
export default new UserController();
