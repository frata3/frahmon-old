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
  async getPostsByUser(id) {
    return await this.#model.find({author: id})
      .sort({ createdAt: -1 })
  }
  async getPostBySlug(slug) {
    return await this.#model
      .findOne({ slug })
      .populate({ path: "tags", select: "name _id" })
      .populate({ path: "author", select: "fullname _id" })
      .lean();
  }  
  async getPostByTag(tag) {
    console.log("test 1 :", tag);
    const post = await this.#model.find( tag ).populate("tags").sort({ createdAt: -1 }).lean();
    console.log("test 2 :", post);
    
    return post;
  }
  async create(postData) {
    const existingPost = await this.#model.findOne({ slug: postData.slug });
    if (existingPost) {
      throw new Error("این آدرس پست قبلا ثبت شده");
    }
    let tagIds = Array.isArray(postData.tags)
      ? postData.tags
      : postData.tags.split(",");
    tagIds = tagIds.map((tag) => tag.trim());
    return this.#model.create({ ...postData, tags: tagIds });
  }
}
module.exports = new PostService();
