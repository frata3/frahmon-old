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
        cssFile: "/auth/style.css",
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { fullname, password, email } = req.body;
      await this.#service.createUser({ fullname, password, email });
      res.redirect("/auth/login");
    } catch (error) {
      res.render("pages/auth/register", {
        title: "ساخت حساب",
        cssFile: "/auth/style.css",
        errorMessage: error.message,
      });
    }
  }
  async loginPage(req, res, next) {
    try {
      res.render("pages/auth/login", {
        title: "ورود به حساب",
        cssFile: "/auth/style.css",
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
      res.redirect("/nest");
    } catch (error) {
      res.render("pages/auth/login", {
        title: "ورود",
        cssFile: "/auth/style.css",
        errorMessage: error.message,
      });
    }
  }
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth/auth/login");
    });
  }
}
module.exports = new AuthController();
