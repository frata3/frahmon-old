const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
const { syncUserToAllModules } = require("../../../common/utils/syncUser.util");
const bcrypt = require("bcrypt");
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async userMainPage(req, res, next) {
    try {
      res.render("pages/user/memain", {
        title: "ناحیه کاربری",
        cssFile: "/user/personal-info.css",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async personalInfoPage(req, res, next) {
    try {
      res.render("pages/user/me/account", {
        title: "ناحیه کاربری",
        cssFile: "/assets/css/user/account.css",
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
      await syncUserToAllModules(user);
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
module.exports = new UserController();
