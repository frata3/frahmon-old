import autoBind from "auto-bind";
import UserService from "../services/user.service.js";
import bcrypt from "bcrypt";
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async userMainPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/user/index.css"],
        js: [{ src: "/scripts/user/main.js", type: "module" }],
      });
      res.render("pages/user/me/main", {
        title: "ناحیه کاربری",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserBlogPosts(req, res, next) {
    try {
      const { sort = "latest" } = req.query;
      const userId = req.session.user._id;

      const blogPosts = await this.#service.findBlogPosts(userId, sort);

      res.render(
        "pages/user/me/blog",
        {
          posts: blogPosts,
          layout: false,
        },
        (err, html) => {
          if (err)
            return res.status(500).send("خطا در بارگزاری پست‌های بلاگ" + err);
          res.send(html);
        }
      );
    } catch (err) {
      next(err);
    }
  }

  async getUserForumPosts(req, res, next) {
    try {
      const { sort = "latest", forumType = "all" } = req.query;
      const userId = req.session.user._id;

      const forumPosts = await this.#service.getForumPosts(
        userId,
        forumType,
        sort
      );

      res.render(
        "pages/user/me/forum",
        {
          posts: forumPosts,
          layout: false,
        },
        (err, html) => {
          if (err)
            return res.status(500).send("خطا در بارگزاری پست‌های فروم" + err);
          res.send(html);
        }
      );
    } catch (err) {
      next(err);
    }
  }

  async getUsersList(req, res, next) {
    try {
      const users = await this.#service.findUsersList();
      res.render(
        "pages/user/me/users-list",
        { users, layout: false },
        (err, html) => {
          if (err) {
            return res.status(500).send("خطا در بارگزاری کاربران ها" + err);
          }
          res.send(html);
        }
      );
    } catch (error) {
      next(error);
    }
  }
  async personalInfoPage(req, res, next) {
    try {
      res.render("pages/user/me/account", { layout: false }, (err, html) => {
        if (err) {
          return res.status(500).send("خطا در بارگزاری اطلاعات کاربری" + err);
        }
        res.send(html);
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
      if (field === "username") {
        const existingUser = await this.#service.findOne({ username: value });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({
            success: false,
            message: "این نام کاربری قبلاً استفاده شده است.",
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
}
export default new UserController();
