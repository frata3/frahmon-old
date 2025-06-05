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
