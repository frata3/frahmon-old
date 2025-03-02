const autoBind = require("auto-bind");

class HomeController {
  constructor() {
    autoBind(this);
  }

  async index(req, res, next) {
      try {
        res.render("./pages/home", {
          title: "صفحه اصلی",
          settings: res.locals.settings,
          cssFile: "home/style.css",
          user: req.session.user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HomeController();
