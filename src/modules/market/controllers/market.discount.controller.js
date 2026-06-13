import autoBind from "auto-bind";
import MarketDiscountService from "../services/market.discount.service.js";
class MarketDiscountController {
  #marketDiscountService;
  constructor() {
    autoBind(this);
    this.#marketDiscountService = MarketDiscountService;
  }
  async createProductDiscount(req, res, next) {
    try {
      // const userId = req.session?.user?._id;
      const { userId, productId, mode, active, code, amount, percent, limit, expiresIn } = req.body;
      const discount = await this.#marketDiscountService.addDiscountToProduct({
        userId,
        productId,
        mode,
        active,
        code,
        amount,
        percent,
        limit,
        expiresIn,
      });
      res.status(201).json(discount);
    } catch (err) {
      console.error(err);
      next(err)
    }
  }
  async applyDiscount(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      const { discountCode, orderId } = req.params;
      const discount = await this.#marketDiscountService.applyDiscount(userId, discountCode, orderId);
      return res.json({
        success: true,
        discount,
        total_amount :discount.total_amount,
        totalDiscount:discount.totalDiscount,
        finalTotal:discount.finalTotal
      })
    } catch (err) {
      console.error(err)
      res.json({ success: false, message: err.message })
      next(err);
    }
  }
  async removeDiscount(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      const { discountId, orderId } = req.params;
      const discount = await this.#marketDiscountService.removeDiscount(userId, discountId, orderId);
      return res.json({success: true, discount})
    } catch (err) {
      console.error(err)
      res.json({ success: false, message: err.message })
      next(err);
    }
  }
}
export default new MarketDiscountController();
