const autoBind = require("auto-bind");
const CategoryModel = require("../models/content.category.model");
const TopicModel = require("../models/content.topic.model");
const TagModel = require("../models/content.tag.model");
const postService = require("../../post/post.service");
class UserService {
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
    return await this.#categoryModel.find({ name: { $regex: query, $options: "i" } }).lean();
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
    return await this.#topicModel.find({ name: { $regex: query, $options: "i" }, category: categoryId }).lean();
  }
  async deleteTopics() {
    return await this.#categoryModel.deleteMany({});
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
    return await this.#tagModel.find({ name: { $regex: query, $options: "i" }, topic: topicId }).lean();
  }
  async getContentsByTag(tagSlug) {
    const tag = await this.#tagModel.findOne({ slug: tagSlug }).lean();
    if (!tag) return null;

    const tagId = tag._id;
    const posts = await this.#postService.getPostByTag({ tags: tagId });
    // const storeProducts = await this.#storeModel.find({ tags: tagId }).sort({ createdAt: -1 }).lean();
    // const forumPosts = await this.#forumModel.find({ tags: tagId }).sort({ createdAt: -1 }).lean();
    return { tag, posts };
  }
  async findBlogPosts(query) {
    return await this.#postService.getPostByTag(query);
  }
  async deleteTags() {
    return await this.#tagModel.deleteMany({});
  }
}

module.exports = new UserService();
