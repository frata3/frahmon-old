const autoBind = require("auto-bind");
const UserModel = require("../models/user.model");
const postModel = require("../../post/post.model")
class UserService {
  #userModel;
  #postModel;
  constructor() {
    autoBind(this);
    this.#userModel = UserModel;
    this.#postModel = postModel;
  }

  async findOne(query) {
    return await this.#userModel.findOne(query);
  }

  async create(userData) {
    const user = new this.#userModel(userData);
    await user.save();
    return user
  }
  async findById(id) {
    return await this.#userModel.findById(id);
  }
  async createPost(postData) {
    const existingPost = await this.#postModel.findOne({ path: postData.titlePath });
    if (existingPost) {
      throw new Error("این آدرس پست قبلا ثبت شده");
    }
    return this.#postModel.create(postData);
  }
}

module.exports = new UserService();
