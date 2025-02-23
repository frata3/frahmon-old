const autoBind = require("auto-bind");
const PostModel = require("./post.model");

class PostService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
  }
  async getPosts() {
    return await PostModel.find()
      .sort({ publishDate: -1 })
      .populate("author category");
  }
  async getPostByTitlePath(titlePath) {
    const post = await this.#model.findOne({ titlePath: titlePath });
    return post;
  }
}
module.exports = new PostService();
