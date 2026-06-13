import autoBind from 'auto-bind';
import AuthService from '../services/auth.service.js';

class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = AuthService;
  }
  async checkEmail(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this.#service.findUserByEmail(email);
      if (user) {
        return res.status(200).json({
          status: "success",
          action: "login required",
        });
      }
      return res.status(200).json({
        status: "success",
        action: "signup required",
      });
  
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error_code: "check email failed",
        message: "Internal server error"
      });
    }
  }
  async renderAuthPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/auth/style.css"],
        js: [{src: "/scripts/auth/auth.js", type: "module", defer: true}]
      });
      res.render("pages/auth/index", {
        title: "ساخت حساب",
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { fullname, password, email, username } = req.body;
  
      const user = await this.#service.createUser({
        fullname,
        password,
        email,
        username,
      });
  
      return res.status(201).json({
        status: "success",
        message: "user_created",
        data: {
          id: user._id,
          username: user.username,
        },
      });
  
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        status: "error",
        error_code: error.code || "registration failed",
        message: error.message || "Registration failed",
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
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password are required"
        });
      }
      const user = await this.#service.authenticate({ email, password });
      req.session.user = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username
      };
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            username: user.username
          }
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(401).json({
        status: "error",
        error_code: "authentication_failed",
        message: error.message || "Invalid email or password"
      });
    }
  }
  logout(req, res) {
    try {
      req.session.destroy((error) => {
        if (error) {
          console.error("Logout error:", error);
          
          if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({
              status: "error",
              error_code: "logout_failed",
              message: "Failed to logout"
            });
          }
          return res.redirect("/");
        }
  
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(200).json({
            status: "success",
            message: "Logout successful"
          });
        }
  
        res.redirect("/");
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(500).json({
          status: "error",
          error_code: "logout_failed",
          message: "Internal server error"
        });
      }
      res.redirect("/");
    }
  }
}
export default new AuthController();
