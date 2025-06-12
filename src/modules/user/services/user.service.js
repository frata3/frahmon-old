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
  async findUsersList() {
    const users = await this.#userModel.find({}, { password: 0, __v: 0 });
    return users;
  }
  async findForPublic(username) {
    const user = await this.#userModel
      .findOne({ username })
      .select("_id username fullname createdAt");
    if (!user) return null;
    return {
      username: user.username,
      fullname: user.fullname,
      joined: user.createdAt,
      userId: user._id,
    };
  }
  async findById(id) {
    return await this.#userModel.findById(id);
  }
  async isEmailTaken(email) {
    return await this.#userModel.findOne({ email });
  }
  async isUsernameTaken(username) {
    return await this.#userModel.findOne({ username });
  }
  async update(user, field, value) {
    user[field] = value;
    await user.save();
    return user;
  }
  async create(userData) {
    const user = new this.#userModel(userData);
    await user.save();
    return user;
  }
  async findPosts(id) {
    return await this.#postService.getPostsByUser(id);
  }
  async findPublicPosts(username) {
    const user = await this.#userModel.findOne({ username }).select("_id");
    if (!user) return [];

    return await this.#postService.getPostsByUser(user._id);
  }
  async createPost(postData) {
    return await this.#postService.create(postData);
  }
}
module.exports = new UserService();
