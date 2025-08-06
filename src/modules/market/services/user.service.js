import autoBind from "auto-bind";
import UserModel from "../models/user.model.js";
import BlogService from "../../blog/blog.service.js";
import ForumService from "../../forum/forum.service.js";
class UserService {
  #userModel;
  #blogService;
  #forumService;
  constructor() {
    autoBind(this);
    this.#userModel = UserModel;
    this.#blogService = BlogService;
    this.#forumService = ForumService;
  }
  async findForSession(query) {
    return await this.#userModel.findOne(query, {
      email: 0,
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
  }
  async findOne(query) {
    return await this.#userModel.findOne(query);
  }
  async findUsersList() {
    const users = await this.#userModel.find({}, { password: 0, __v: 0 });
    return users;
  }
  async findByUsername(username) {
    return await this.#userModel
      .findOne({ username })
      .select("_id username fullname avatar");
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
  async findBlogPosts(userId, sort = "latest") {
    return await this.#blogService.findUserPosts(userId, sort);
  }
  async getForumPosts(userId, type = "all", sort = "latest") {
    return await this.#forumService.getUserForumPosts(userId, type, sort);
  }
  async findPublicPosts(username) {
    const user = await this.#userModel.findOne({ username }).select("_id");
    if (!user) return [];

    return await this.#blogService.getPostsByUser(user._id);
  }
  async createPost(postData) {
    return await this.#blogService.create(postData);
  }
}
export default new UserService();
