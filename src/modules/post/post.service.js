const autoBind = require("auto-bind");
const PostModel = require("./post.model");

class PostService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
  }
  async getPosts() {
    return await this.#model.find()
      .sort({ publishDate: -1 })
  }
  async getPostByTitlePath(titlePath) {
    const post = await this.#model.findOne({ titlePath: titlePath });
    return post;
  }
  async createPost(postData) {
    const newPost = new this.#model(postData);
    await newPost.save();
    return newPost;
  }
}
module.exports = new PostService();
