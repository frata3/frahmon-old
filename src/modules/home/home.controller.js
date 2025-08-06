import autoBind from 'auto-bind';
import HomeService from './home.service.js';

class HomeController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = HomeService;
  }
  async getHomePage(req, res, next) {
    try {
      // res.addAssets({
      //   css: ["/assets/css/main/main.css"],
      //   js: [{ src: "/scripts/main/main.js", type: "module" }],
      // });
        res.render("./pages/home", {
            title: "صفحه اصلی",
            // settings: res.locals.settings,
            user: req.session.user,
          });
    } catch (error) {
      next(error);
    }
  }
}

export default new HomeController();
