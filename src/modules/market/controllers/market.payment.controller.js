import autoBind from "auto-bind";
import MarketPaymentService from "../services/market.payment.service.js";
class MarketPaymentController {
  #marketPaymentService;
  constructor() {
    autoBind(this);
    this.#marketPaymentService = MarketPaymentService;
  }
  async getPayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const payment = await this.#marketPaymentService.getPaymentById(
        paymentId
      );
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  async updatePaymentAuthority(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { authority } = req.body;
      const payment = await this.#marketPaymentService.updatePaymentAuthority(
        paymentId,
        authority
      );
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
}
export default new MarketPaymentController();
