import autoBind from "auto-bind";
import { Order, OrderItems } from "../models/market.order.model.js";
import Payment from "../models/market.payment.model.js";
import marketBasketService from "./market.basket.service.js";
import { Product } from "../models/market.product.model.js";
import { sequelize } from "../../../config/sequelize.config.js";
import Discount from "../models/market.discount.model.js";

class MarketOrderService {
  #orderItemModel;
  #orderModel;
  #basketService;
  #productModel;
  #discountModel;
  #paymentModel;
  constructor() {
    autoBind(this);
    this.#paymentModel = Payment;
    this.#orderModel = Order;
    this.#orderItemModel = OrderItems;
    this.#productModel = Product;
    this.#paymentModel = Discount;
    this.#basketService = marketBasketService;
  }
  async createOrder({ userId, basketId }) {
    const order = await this.#orderModel.findOne({
      where: { userId, basketId },
    });
    if (order) return { order };
    return sequelize.transaction(async (t) => {
      const { basket, totalAmount, finalAmount, totalDiscount } =
        await this.#basketService.getUserBasketById(basketId, userId);

      if (!basket || !basket.items?.length) {
        throw new Error("Basket is empty or not found");
      }

      const order = await this.#orderModel.create(
        {
          userId,
          paymentId: null,
          basketId: basket.id,
          total_amount: totalAmount,
          final_amount: finalAmount,
          discount_amount: totalDiscount,
        },
        { transaction: t }
      );

      const orderList = basket.items.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        count: item.count,
      }));

      await this.#orderItemModel.bulkCreate(orderList, { transaction: t });

      return { order };
    });
  }
  async existOrders({ userId, basketIds }) {
    const orders = await this.#orderModel.findAll({
      where: {
        userId,
        basketId: basketIds,
      },
      attributes: ["basketId"],
    });

    const result = {};
    basketIds.forEach((id) => {
      result[id] = { hasOrder: false };
    });
    orders.forEach((order) => {
      result[order.basketId] = { hasOrder: true };
    });

    return result;
  }
  // async getOrderById(userId, orderId) {
  //   const order = await this.#orderModel.findOne({
  //     where: { id: orderId, userId },
  //     include: [
  //       {
  //         model: this.#orderItemModel,
  //         as: "items",
  //         include: [
  //           {
  //             model: this.#productModel,
  //             as: "product",
  //             attributes: ["id", "title", "price"],
  //           },
  //         ],
  //       },
  //       {
  //         association: this.#orderModel.associations.discounts,
  //         attributes: ["id", "code", "type", "amount", "percent"],
  //         through: { attributes: [] },
  //       },
  //     ],
  //   });
  //   if (!order) {
  //     throw new Error("Order not found");
  //   }
  //   return order;
  // }
  async getOrderById(userId, orderId) {
    const order = await this.#orderModel.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: this.#orderItemModel,
          as: "items",
          include: [
            {
              model: this.#productModel,
              as: "product",
              attributes: ["id", "title", "price", "discountCap"],
            },
          ],
        },
        {
          association: this.#orderModel.associations.discounts,
          attributes: ["id", "code", "type", "amount", "percent", "targetId"], // Added targetId
          through: { 
            attributes: [],
          },
        },
      ],
    });
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    if (order.discounts && order.discounts.length > 0) {
      order.discountBreakdown = await this.calculateDiscountBreakdown(order);
    }
    
    return order;
  }

  async calculateDiscountBreakdown(order) {
    const breakdown = [];
    
    for (const discount of order.discounts) {
      let discountedItems = [];
      let discountAmount = 0;
      
      if (discount.type === "product") {
        discountedItems = order.items.filter(
          (item) => item.productId === discount.targetId
        );
      } else if (discount.type === "basket") {
        discountedItems = order.items.filter(
          (item) => item.product.sellerId === discount.targetId
        );
      }
      
      for (const item of discountedItems) {
        let itemDiscount = 0;
        if (discount.amount) {
          itemDiscount = discount.amount * item.count;
        } else if (discount.percent) {
          itemDiscount = ((item.product.price * discount.percent) / 100) * item.count;
        }
        
        if (item.product.discountCap && itemDiscount > item.product.discountCap * item.count) {
          itemDiscount = item.product.discountCap * item.count;
        }
        
        discountAmount += itemDiscount;
      }
      
      breakdown.push({
        code: discount.code,
        type: discount.type,
        discountAmount: discountAmount,
        affectedItems: discountedItems.length
      });
    }
    
    return breakdown;
  }
}
export default new MarketOrderService();