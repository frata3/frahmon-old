const autoBind = require("auto-bind");
const CategoryModel = require("../models/content.category.model");
const TopicModel = require("../models/content.topic.model");
const TagModel = require("../models/content.tag.model");
class UserService {
  #categoryModel;
  #topicModel;
  #tagModel;
  constructor() {
    autoBind(this);
    this.#categoryModel = CategoryModel;
    this.#topicModel = TopicModel;
    this.#tagModel = TagModel;
  }

  async createCategories(data) {
    return await this.#categoryModel.create(data);
  }
  async findCategories(query) {
    return await this.#categoryModel.find(query); 
  }
  async findCategory(query) {
    return await this.#categoryModel.findOne(query).lean(); 
  }
  async deleteCategories() {
    return await this.#categoryModel.deleteMany({});
  }

  async createTopics(data) {
    return await this.#topicModel.create(data);
  }
  async findTopics(query) {
    return await this.#topicModel.find(query);
}
  async findTopic(query) {
    return await this.#topicModel.findOne(query).lean();
  }
  async deleteTopics() {
    return await this.#categoryModel.deleteMany({});
  }

  async findTag(query) {
    return await this.#tagModel.findOne(query);
  }

}

module.exports = new UserService();
