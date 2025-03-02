const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async nestMainPage(req, res, next) {
    try {
      res.render("pages/nest/main", {
        title: "ناحیه کاربری",
        cssFile: "/nest/personal-info.css",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async personalInfoPage(req, res, next) {
    try {
      res.render("pages/nest/personal-info", {
        title: "ناحیه کاربری",
        cssFile: "/nest/personal-info.css",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async updatePersonalInfo(req, res, next) {
    try {
      const { field, value } = req.body;
      const userId = req.session.user._id;
      const user = await this.#service.findById(userId);

      if (!user.schema.path(field)) {
        return res
          .status(400)
          .json({ success: false, message: "فیلد مورد نظر وجود ندارد." });
      }
      if (field === "email") {
        const existingUser = await this.#service.findOne({ email: value });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({
            success: false,
            message: "این ایمیل قبلاً استفاده شده است.",
          });
        }
      }
      if (field === "password") {
        const isMatch = await bcrypt.compare(value, user.password);
        if (isMatch) {
          return res.status(400).json({
            success: false,
            message: "رمز عبور جدید نمی‌تواند همان رمز قبلی باشد.",
          });
        }
        user.password = await bcrypt.hash(value, 10);
      }
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "کاربر یافت نشد" });
      }
      await user.save();
      user[field] = value;
      await user.save();

      res.json({ success: true, message: "اطلاعات با موفقیت بروزرسانی شد." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "خطا در بروزرسانی اطلاعات" });
      next(error);
    }
  }
  async updateUserPassword(req, res, next) {
    try {
      const userId = req.session.user._id;
      const user = await this.#service.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "کاربر یافت نشد" });
      }

      res.json({ success: true, password: user.password });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "خطا در دریافت رمز عبور" });
    }
  }
  async createPostPage(req, res, next) {
    try {
      res.render("pages/nest/create-post", {
        title: "ساخت پست بلاگ",
        cssFile: "/nest/create-post.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, titlePath, description, content, author } = req.body;
      console.log(req.body);
      if (!titlePath || !title || !description || !content || !author) {
        throw new Error("تمام فیلدهای اجباری باید پر شوند!");
      }
      const postData = {
        title,
        titlePath,
        description,
        content,
        author,
      };

      await this.#service.createPost(postData);
      res.redirect("/nest");
    } catch (error) {
      next(error);
    }
  }
  async addItemPage(req, res, next) {
    try {
      res.render("pages/nest/add-item", {
        title: "ساخت پست بلاگ",
        cssFile: "/nest/add-item.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async addItem(req, res, next) {
    try {
      const { title, titlePath, description, content, author } = req.body;
      console.log(req.body);
      if (!titlePath || !title || !description || !content || !author) {
        throw new Error("تمام فیلدهای اجباری باید پر شوند!");
      }
      const postData = {
        title,
        titlePath,
        description,
        content,
        author,
      };

      await this.#service.createPost(postData);
      res.redirect("/nest");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
