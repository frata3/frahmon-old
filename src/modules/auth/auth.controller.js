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
      await this.#service.createUser(req.body);
      res.redirect("/auth/auth/login");
    } catch (error) {
      next(error);
    }
  }
  async loginPage(req, res, next) {
    try {
      res.render("pages/auth/login", {
        title: "ورود به حساب",
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const user = await this.#service.authenticate(req.body);
      req.session.user = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      };
      res.redirect("/nest");
    } catch (error) {
      next(error);
    }
  }
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth/auth/login");
    });
  }
}

module.exports = new AuthController();
