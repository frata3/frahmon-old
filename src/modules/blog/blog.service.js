import autoBind from 'auto-bind';
import PostModel from './blog.model.js';
import UserModel from './blog.user.model.js';

class PostService {
  #model;
  #userModel;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
    this.#userModel = UserModel;
  }
  async findUserById(id) {
    return await this.#userModel.findById(id);
  }
  async createOrUpdateUser(data) {
    const updatedUser = await this.#userModel.findOneAndUpdate(
      { _id: data._id },
      { $set: { username: data.username, fullname: data.fullname } },
      { new: true, upsert: true, runValidators: true }
    );
    return updatedUser;
  }
  
  async getPosts() {
    return await this.#model
      .find({})
      .populate({ path: "author", select: "_id fullname username avatar" })
      .lean();
  }
  
  async findUserPosts(userId, sort) {
    const sortOrder = sort === "oldest" ? 1 : -1;
    return await this.#model.find({ author: userId })
      .sort({ createdAt: sortOrder })
      .lean();
  }
  async getPostById(id) {
    return await this.#model
      .findOne({ _id: id })
      .populate([
        // { path: "tags", select: "name slug" },
        { path: "author", select: "fullname username _id" }
      ])
      .lean();
  }
  async deleteById(id) {
    return await this.#model.findByIdAndDelete(id);
  }
  async getPostByTag(tag) {
    const post = await this.#model.find( tag ).populate("tags").sort({ createdAt: -1 }).lean();
    return post;
  }
  async createPost(data) {
    return this.#model.create( data );
  }
}
export default new PostService();
