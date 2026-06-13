import autoBind from "auto-bind";
import MarketOrderService from "../services/market.order.service.js";
class MarketOrderController {
  #marketOrderService;
  constructor() {
    autoBind(this);
    this.#marketOrderService = MarketOrderService;
  }
  async createOrder(req, res, next) {
    try {
      const userId = req.session?.user?._id;

      const { basketId } = req.params;
      const { order } = await this.#marketOrderService.createOrder({
        userId,
        basketId,
      });
      return res.status(201).json({
        success: true,
        orderId: order.id,
        message: "Order created successfully",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  async checkOrder(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      const { basketIds } = req.body;
      const data = await this.#marketOrderService.existOrders({ userId, basketIds });
      res.json({ data });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  async showOrder(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      if (!userId) return res.redirect("/auth/login");
      const { orderId } = req.params;
      const order = await this.#marketOrderService.getOrderById(
        userId,
        orderId
      );
      res.addAssets({
        css: ["/assets/css/market/order.css"],
        js: [{ src: "/scripts/market/order.js", type: "module", defer: true }],
      });
      res.render("pages/market/order/index", {
        title: "نمایش سفارش",
        order,
      });
    } catch (err) {
      next(err);
    }
  }
}
export default new MarketOrderController();
