import autoBind from "auto-bind";
import MarketBasketService from "../services/market.basket.service.js";
class MarketBasketController {
  #marketBasketService;
  constructor() {
    autoBind(this);
    this.#marketBasketService = MarketBasketService;
  }
  async addToBasket(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      if (!userId) return res.json({ success: false, message: "ابتدا وارد حساب کاربری خود شوید" });
      const { productId, sellerId } = req.params;

      const product = await this.#marketBasketService.createOrAddItem(userId, productId, sellerId);
      if (product) {
        return res.json({ success: true, message: "محصول به سبد خرید اضافه شد" })
      } else {
        return res.json({ success: false, message: "userBasketError" })
      }
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
  async removeFromBasket(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      if (!userId) return res.json({ success: false, message: "ابتدا وارد حساب کاربری خود شوید" });
  
      const { productId, sellerId } = req.params;
      const remaining = await this.#marketBasketService.removeOrDecreaseItem(userId, productId, sellerId);
  
      if (remaining === null) return res.json({ success: false, message: "آیتمی یافت نشد" });
      return res.json({success: true, remaining});
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  
  
  async getUserBaskets(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      if (!userId) {
        return res.render("pages/market/basket/baskets.ejs", {
          title: "سبد های خرید",
          currentUser: null,
          baskets: null,
        });
      }
      const baskets = await this.#marketBasketService.getAllBaskets(userId);
      // return res.json({baskets})
      if (!baskets) {
        return res
          .status(404)
          .render("errors/basket-is-empty.ejs", { title: "سبد خرید شما خالی است" });
      }
      res.addAssets({
        css: ["/assets/css/market/basket.css"],
        js: [
          { src: "/scripts/market/basket.js", type: "module", defer: true },
        ],
      });
      res.render("pages/market/basket/baskets.ejs", {
        title: "سبد های خرید",
        baskets,
      });
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
}
export default new MarketBasketController();