import autoBind from 'auto-bind';
import CategoryModel from '../models/content.category.model.js';
import TopicModel from '../models/content.topic.model.js';
import TagModel from '../models/content.tag.model.js';
import postService from '../../blog/blog.service.js';

class ContentService {
  #categoryModel;
  #topicModel;
  #tagModel;
  #postService;

  constructor() {
    autoBind(this);
    this.#categoryModel = CategoryModel;
    this.#topicModel = TopicModel;
    this.#tagModel = TagModel;
    this.#postService = postService;
  }

  async createCategories(data) {
    return await this.#categoryModel.create(data);
  }
  async findCategories(query) {
    return await this.#categoryModel.find(query).lean();
  }

  async getRawCategoryData() {
    const categories = await this.#categoryModel.find({}).lean();
    const topics = await this.#topicModel.find({}).lean();
    const tags = await this.#tagModel.find({}).lean();
    return { categories, topics, tags };
  }
  async exploreCategories(query = {}) {
    return await this.#categoryModel
      .find(query)
      .sort({ popularity: -1 })
      .limit(10)
      .lean();
  }

  async findCategory(query) {
    return await this.#categoryModel.findOne(query).lean();
  }

  async searchCategories(query) {
    return await this.#categoryModel
      .find({ name: { $regex: query, $options: "i" } })
      .lean();
  }

  async deleteCategories() {
    return await this.#categoryModel.deleteMany({});
  }

  async createTopics(data) {
    return await this.#topicModel.create(data);
  }

  async findTopics(query) {
    return await this.#topicModel.find(query).lean();
  }

  async exploreTopics(query = {}) {
    return await this.#topicModel
      .find(query)
      .sort({ popularity: -1 })
      .limit(5)
      .lean();
  }

  async findTopic(query) {
    return await this.#topicModel.findOne(query).lean();
  }

  async searchTopics(query, categoryId) {
    return await this.#topicModel
      .find({
        name: { $regex: query, $options: "i" },
        categories: categoryId,
      })
      .lean();
  }

  async deleteTopics() {
    return await this.#topicModel.deleteMany({});
  }

  async findTag(query) {
    return await this.#tagModel.findOne(query);
  }

  async createTags(data) {
    return await this.#tagModel.create(data);
  }

  async findTags(query) {
    return await this.#tagModel.find(query).lean();
  }

  async searchTags(query, topicId) {
    return await this.#tagModel
      .find({
        name: { $regex: query, $options: "i" },
        topics: topicId,
      })
      .lean();
  }

  async getContentsByTag(tagSlug) {
    const tag = await this.#tagModel.findOne({ slug: tagSlug }).lean();
    if (!tag) return null;

    const tagId = tag._id;
    const posts = await this.#postService.getPostByTag({ tags: tagId });
    return { tag, posts };
  }

  async findBlogPosts(query) {
    return await this.#postService.getPostByTag(query);
  }

  async deleteTags() {
    return await this.#tagModel.deleteMany({});
  }
  async seedInitialContent() {
    const categoryCount = await this.#categoryModel.countDocuments();
    if (categoryCount > 0) {
      console.log("Seed data already exists. Skipping seeding.");
      return;
    }
  
    // ۱. ساختن دسته‌بندی‌ها
    const categories = await this.#categoryModel.insertMany([
      { name: "AI", slug: "ai", description: "هوش مصنوعی" },
      { name: "Web", slug: "web", description: "توسعه وب" },
    ]);
  
    // ۲. ساختن تاپیک‌ها و اتصال به دسته‌بندی‌ها
    const topics = await this.#topicModel.insertMany([
      {
        name: "GPT",
        slug: "gpt",
        description: "مدل‌های زبانی",
        categories: [categories[0]._id],
      },
      {
        name: "React",
        slug: "react",
        description: "کتابخانه رابط کاربری",
        categories: [categories[1]._id],
      },
    ]);
  
    // ۳. ساختن تگ‌ها و اتصال به تاپیک‌ها
    await this.#tagModel.insertMany([
      {
        name: "tokens",
        slug: "tokens",
        topics: [topics[0]._id],
      },
      {
        name: "hooks",
        slug: "hooks",
        topics: [topics[1]._id],
      },
    ]);
  
    console.log("Seed content created successfully.");
  }
}

export default new ContentService();


