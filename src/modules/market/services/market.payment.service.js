import autoBind from "auto-bind";
import Payment from "../models/market.payment.model.js";

class MarketPaymentService {
  #paymentModel;
  constructor() {
    autoBind(this);
    this.#paymentModel = Payment;
  }
  async getPaymentById(paymentId) {
    return this.#paymentModel.findByPk(paymentId);
  }
  async updatePaymentAuthority(paymentId, authority) {
    const payment = await this.#paymentModel.findByPk(paymentId);
    if (!payment) return null;
    payment.authority = authority;
    await payment.save();
    return payment;
  }
}
export default new MarketPaymentService();