import autoBind from "auto-bind";
import {
  Order,
  OrderDiscount,
  OrderItems,
} from "../models/market.order.model.js";
import { Product } from "../models/market.product.model.js";
import { sequelize } from "../../../config/sequelize.config.js";
import { randomBytes } from "crypto";
import Discount from "../models/market.discount.model.js";
import User from "../models/market.user.model.js";
import marketOrderService from "./market.order.service.js";

class MarketDiscountService {
  #discountModel;
  #productModel;
  #userModel;
  #orderDiscountModel;
  #orderService;
  #orderItemModel;
  #orderModel;
  constructor() {
    autoBind(this);
    this.#discountModel = Discount;
    this.#userModel = User;
    this.#productModel = Product;
    this.#orderDiscountModel = OrderDiscount;
    this.#orderService = marketOrderService;
    this.#orderModel = Order;
    this.#orderItemModel = OrderItems;
  }

  async addDiscountToProduct({
    userId,
    productId,
    mode = "code",
    active = true,
    code,
    amount,
    percent,
    limit,
    expiresIn,
  }) {
    const product = await this.#productModel.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (!amount && !percent)
      throw new Error("Either amount or percent must be provided");
    const discount = await this.#discountModel.create({
      sellerId: userId,
      type: "product",
      targetId: product.id,
      mode: mode,
      active: active,
      code,
      amount: amount ?? null,
      percent: percent ?? null,
      limit: limit ?? null,
      usage: 0,
      expires_in: expiresIn ?? null,
    });

    return discount;
  }
  async addDiscountToBasket({
    userId,
    mode = "code",
    active = true,
    discountCode,
    amount,
    percent,
    limit,
    expiresIn,
  }) {
    // const seller = await this.#userModel.findOne({ where: { id: userId } });
    const seller = await this.#userModel.findByPk(userId);
    if (!seller) throw new Error("Seller not found");

    if (!amount && !percent)
      throw new Error("Either amount or percent must be provided");
    const discount = await this.#discountModel.create({
      sellerId: userId,
      type: "basket",
      targetId: userId,
      mode: mode,
      active: active,
      discountCode,
      amount: amount ?? null,
      percent: percent ?? null,
      limit: limit ?? null,
      usage: 0,
      expires_in: expiresIn ?? null,
    });

    return discount;
  }
  // async applyDiscount(buyerId, discountCode, orderId) {
  //   const discount = await this.#discountModel.findOne({
  //     where: { code: discountCode, active: true },
  //   });
  //   if (!discount) throw new Error("Invalid or inactive discount code");
  //   const order = await this.#orderService.getOrderById(buyerId, orderId);
  //   if (!order) throw new Error("Order not found");
  //   let discountedItems = [];
  //   if (discount.type === "product") {
  //     discountedItems = order.items.filter(
  //       (item) => item.productId === discount.targetId
  //     );
  //     if (discountedItems.length === 0) {
  //       throw new Error("Discount not applicable to this order");
  //     }
  //   } else if (discount.type === "basket") {
  //     const allFromSeller = order.items.every(
  //       (item) => item.product.sellerId === discount.targetId
  //     );
  //     if (!allFromSeller)
  //       throw new Error("Discount not applicable to this basket");
  //     discountedItems = order.items;
  //   }
  //   let totalDiscount = 0;
  //   for (const item of discountedItems) {
  //     if (discount.amount) {
  //       totalDiscount += discount.amount * item.count;
  //     } else if (discount.percent) {
  //       totalDiscount +=
  //         ((item.product.price * discount.percent) / 100) * item.count;
  //     }
  //   }
  //   const finalTotal = order.total_amount - totalDiscount;
  //   order.discountId = discount.id;
  //   order.discount_amount = totalDiscount;
  //   order.final_amount = finalTotal;
  //   await order.save();
  //   await this.#orderDiscountModel.create({
  //     id: null,
  //     orderId: order.id,
  //     discountId: discount.id,
  //   });
  //   return {
  //     discountType: discount.type,
  //     target:
  //       discount.type === "product"
  //         ? {
  //             productId: discount.targetId,
  //             productTitle: discountedItems[0]?.product?.title || null,
  //           }
  //         : {
  //             sellerId: discount.targetId,
  //           },
  //     total_amount: order.total_amount,
  //     discount: discount.amount || discount.percent,
  //     totalDiscount,
  //     finalTotal,
  //   };
  // }
  async applyDiscount(buyerId, discountCode, orderId) {
    const discount = await this.#discountModel.findOne({
      where: { code: discountCode, active: true },
    });
    if (!discount) throw new Error("Invalid or inactive discount code");

    const order = await this.#orderService.getOrderById(buyerId, orderId);
    if (!order) throw new Error("Order not found");

    const existingDiscount = await this.#orderDiscountModel.findOne({
      where: {
        orderId: order.id,
        discountId: discount.id,
      },
    });
    if (existingDiscount) {
      throw new Error(
        "This discount code has already been applied to this order"
      );
    }

    let discountedItems = [];
    if (discount.type === "product") {
      discountedItems = order.items.filter(
        (item) => item.productId === discount.targetId
      );
      if (discountedItems.length === 0) {
        throw new Error("Discount not applicable to this order");
      }
    } else if (discount.type === "basket") {
      const allFromSeller = order.items.every(
        (item) => item.product.sellerId === discount.targetId
      );
      if (!allFromSeller)
        throw new Error("Discount not applicable to this basket");
      discountedItems = order.items;
    }

    let currentDiscount = 0;
    for (const item of discountedItems) {
      let itemDiscount = 0;
      if (discount.amount) {
        itemDiscount = discount.amount * item.count;
      } else if (discount.percent) {
        itemDiscount =
          ((item.product.price * discount.percent) / 100) * item.count;
      }

      if (
        item.product.discountCap &&
        itemDiscount > item.product.discountCap * item.count
      ) {
        itemDiscount = item.product.discountCap * item.count;
      }

      currentDiscount += itemDiscount;
    }
    const currentTotalDiscount = parseFloat(order.discount_amount || 0);
    const orderTotal = parseFloat(order.total_amount);

    const newTotalDiscount = currentTotalDiscount + currentDiscount;
    const finalTotal = orderTotal - newTotalDiscount;

    if (finalTotal < 0) {
      throw new Error("Total discount amount exceeds order total");
    }

    order.discount_amount = newTotalDiscount;
    order.final_amount = finalTotal;
    order.discountId = discount.id;
    await order.save();

    await this.#orderDiscountModel.create({
      orderId: order.id,
      discountId: discount.id,
    });

    return {
      discountType: discount.type,
      target:
        discount.type === "product"
          ? {
              productId: discount.targetId,
              productTitle: discountedItems[0]?.product?.title || null,
            }
          : {
              sellerId: discount.targetId,
            },
      total_amount: order.total_amount,
      discount: discount.amount || discount.percent,
      isPercentage: !!discount.percent,
      currentDiscountAmount: currentDiscount,
      totalDiscountAmount: newTotalDiscount,
      finalTotal,
      appliedDiscounts: await this.getAppliedDiscounts(orderId),
    };
  }
  async getAppliedDiscounts(orderId) {
    const order = await this.#orderModel.findByPk(orderId, {
      include: [
        {
          model: this.#discountModel,
          as: "discounts",
          attributes: ["id", "code", "type", "amount", "percent", "targetId"],
          through: {
            attributes: ["created_at"],
          },
        },
      ],
    });

    if (!order) {
      throw new Error("Order not found");
    }
    return order.discounts.map((discount) => ({
      discountId: discount.id,
      orderId: orderId,
      code: discount.code,
      type: discount.type,
      amount: discount.amount,
      percent: discount.percent,
      targetId: discount.targetId,
      appliedAt: discount.order_discounts?.created_at,
    }));
  }
  async removeDiscount(userId, discountId, orderId) {
    // Get the order and verify ownership
    const order = await this.#orderService.getOrderById(userId, orderId);
    if (!order) {
      throw new Error("Order not found");
    }
  
    // Check if the discount is actually applied to this order
    const orderDiscount = await this.#orderDiscountModel.findOne({
      where: { 
        orderId: orderId,
        discountId: discountId 
      }
    });
  
    if (!orderDiscount) {
      throw new Error("This discount code is not applied to this order");
    }
  
    // Get the discount details to recalculate the amount
    const discount = await this.#discountModel.findOne({
      where: { id: discountId, active: true }
    });
  
    if (!discount) {
      throw new Error("Discount not found");
    }
  
    // Calculate how much this specific discount contributed
    let discountToRemove = 0;
    let discountedItems = [];
  
    if (discount.type === "product") {
      discountedItems = order.items.filter(
        (item) => item.productId === discount.targetId
      );
    } else if (discount.type === "basket") {
      discountedItems = order.items.filter(
        (item) => item.product.sellerId === discount.targetId
      );
    }
  
    // Calculate the discount amount that was applied
    for (const item of discountedItems) {
      let itemDiscount = 0;
      if (discount.amount) {
        itemDiscount = discount.amount * item.count;
      } else if (discount.percent) {
        itemDiscount = ((item.product.price * discount.percent) / 100) * item.count;
      }
  
      // Apply discount cap if product has one
      if (item.product.discountCap && itemDiscount > item.product.discountCap * item.count) {
        itemDiscount = item.product.discountCap * item.count;
      }
  
      discountToRemove += itemDiscount;
    }
  
    // Update order amounts
    const currentTotalDiscount = parseFloat(order.discount_amount || 0);
    const orderTotal = parseFloat(order.total_amount);
    
    const newTotalDiscount = Math.max(0, currentTotalDiscount - discountToRemove);
    const finalTotal = orderTotal - newTotalDiscount;
  
    // Update the order
    order.discount_amount = newTotalDiscount;
    order.final_amount = finalTotal;
    
    // If this was the last discount, clear the discountId field
    const remainingDiscounts = await this.#orderDiscountModel.count({
      where: { orderId: orderId }
    });
    
    if (remainingDiscounts <= 1) { // Will be 0 after we delete this one
      order.discountId = null;
    }
  
    await order.save();
  
    // Remove the discount association
    await this.#orderDiscountModel.destroy({
      where: { 
        orderId: orderId,
        discountId: discountId 
      }
    });
  
    // Get updated applied discounts
    const updatedAppliedDiscounts = await this.getAppliedDiscounts(orderId);
  
    return {
      discountType: discount.type,
      removedDiscount: {
        code: discount.code,
        amount: discount.amount,
        percent: discount.percent,
        discountAmount: discountToRemove
      },
      total_amount: order.total_amount,
      totalDiscountAmount: newTotalDiscount,
      finalTotal: finalTotal,
      appliedDiscounts: updatedAppliedDiscounts
    };
  }
}
export default new MarketDiscountService();
