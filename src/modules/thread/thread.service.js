const autoBind = require("auto-bind");
const PostModel = require("./");

class PostService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
  }
  async getAllThreads() {
    return this.#model.find().populate("author", "username").populate("tags", "name").lean();
}

async getThreadById(threadId) {
    return this.#model.findById(threadId).populate("author", "username").populate("tags", "name").lean();
}

async createThread(threadData) {
    return this.#model.create(threadData);
}
}
module.exports = new PostService();
