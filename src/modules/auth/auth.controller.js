import autoBind from 'auto-bind';
import AuthService from './auth.service.js';

class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = AuthService;
  }
  async registerPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/auth/style.css"],
        js: ["/script"]
      });
      res.render("pages/auth/register", {
        title: "ساخت حساب",
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
        errorMessage: error.message,
      });
    }
  }
  async loginPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/auth/style.css"]
      });
      
      res.render("pages/auth/login", {
        title: "ورود به حساب",
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
export default new AuthController();
