const autoBind = require("auto-bind");
const AuthService = require("./auth.service");

class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = AuthService;
  }
  async registerPage(req, res, next) {
    try {
      res.render("pages/auth/register", {
        title: "ساخت حساب",
        cssFile: "/assets/css/auth/style.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { fullname, password, email, username } = req.body;
      await this.#service.createUser({ fullname, password, email, username });
      res.redirect("/auth/login");
    } catch (error) {
      res.render("pages/auth/register", {
        title: "ساخت حساب",
        cssFile: "/assets/css/auth/style.css",
        errorMessage: error.message,
      });
    }
    // try {
    //   const users = Array.isArray(req.body) ? req.body : [req.body];
  
    //   const createdUsers = await Promise.all(
    //     users.map(({ fullname, password, email, username }) =>
    //       this.#service.createUser({ fullname, password, email, username })
    //     )
    //   );
  
    //   res.status(201).json({ users: createdUsers });
    // } catch (err) {
    //   console.error("❌ createUsers error:", err);
    //   res.status(500).json({ message: "خطا در ایجاد کاربران" });
    // }
  }
  async loginPage(req, res, next) {
    try {
      res.render("pages/auth/login", {
        title: "ورود به حساب",
        cssFile: "/assets/css/auth/style.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.#service.authenticate({ email, password });
      req.session.user = user;
      res.redirect("/me");
    } catch (error) {
      res.render("pages/auth/login", {
        title: "ورود",
        cssFile: "/assets/css/auth/style.css",
        errorMessage: error.message,
      });
    }
  }
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}
module.exports = new AuthController();
