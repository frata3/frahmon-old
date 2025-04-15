const autoBind = require("auto-bind");
const UserModel = require("../models/user.model");
const postService = require("../../post/post.service");
class UserService {
  #userModel;
  #postService;
  constructor() {
    autoBind(this);
    this.#userModel = UserModel;
    this.#postService = postService;
  }

  async findOne(query) {
    return await this.#userModel.findOne(query);
  }

  async create(userData) {
    const user = new this.#userModel(userData);
    await user.save();
    return user;
  }
  async findById(id) {
    return await this.#userModel.findById(id);
  }
  async findPosts(id) {
    return await this.#postService.getPostsByUser(id);
  }
  async createPost(postData) {
    return await this.#postService.create(postData);
  }
}
module.exports = new UserService();
