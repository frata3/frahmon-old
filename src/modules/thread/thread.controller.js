const autoBind = require("auto-bind");
const ThreadService = require("./thread.service");

class ThreadController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = ThreadService;
  }
  async getAllThreads(req, res, next) {
    try {
      const threads = await this.#service.getAllThreads();
      res.render("pages/forum/forum", { threads });
    } catch (error) {
        next(error)
    }
  }

  async getThreadBySlug(req, res) {
    try {
      const thread = await this.#service.getThreadById(req.params.threadId);
      if (!thread) return res.status(404).send("موضوع پیدا نشد");
      res.render("pages/forum/thread", { thread });
    } catch (error) {
      console.error(error);
      res.status(500).send("خطایی رخ داده است.");
    }
  }

  async createThread(req, res) {
    try {
      const { title, content, author, tags } = req.body;
      if (!title || !content || !author) {
        return res.status(400).send("تمام فیلدهای اجباری را پر کنید.");
      }
      const newThread = await this.#service.createThread({
        title,
        content,
        author,
        tags,
      });
      res.redirect("/threads/" + newThread._id);
    } catch (error) {
      console.error(error);
      res.status(500).send("خطایی رخ داده است.");
    }
  }
}

module.exports = new ThreadController();
