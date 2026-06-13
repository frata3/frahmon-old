import autoBind from "auto-bind";
import MarketService from "../services/market.service.js";
class MarketController {
  #marketService;
  constructor() {
    autoBind(this);
    this.#marketService = MarketService;
  }
  async getMainPage(req, res, next) {
    try {
      const products = await this.#marketService.getProducts()
      res.addAssets({
        css: ["/assets/css/market/index.css"],
        js: [
          { src: "/scripts/market/main.js", type: "module", defer: true },
        ],
      });
    res.render("./pages/market/product/index.ejs", {
      title: "تجارت",
      products
    })
  } catch (err) {
    console.error("Error in marketController:", err);
    next(err);
  }
  }
}
export default new MarketController();