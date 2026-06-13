import autoBind from "auto-bind";
import { Basket, BasketItem } from "../models/market.basket.model.js";
import { Product, ProductDetail } from "../models/market.product.model.js";
import User from "../models/market.user.model.js";
import Discount from "../models/market.discount.model.js";

class MarketBasketService {
  #basketModel;
  #itemModel;
  #productModel;
  #ProductDetailModel;
  #userModel;
  #discountModel;
  constructor() {
    autoBind(this);
    this.#basketModel = Basket;
    this.#itemModel = BasketItem;
    this.#productModel = Product;
    this.#ProductDetailModel = ProductDetail;
    this.#userModel = User;
    this.#discountModel = Discount;
  }
  async createOrAddItem(buyerId, productId, sellerId) {
    if (!buyerId || !productId || !sellerId) {
      throw new Error("buyerId, productId, and sellerId are required");
    }
    let basket = await this.#basketModel.findOne({
      where: { buyerId, sellerId },
    });
    if (!basket) {
      basket = await this.#basketModel.create({ buyerId, sellerId });
    }
    let item = await this.#itemModel.findOne({
      where: { basketId: basket.id, productId },
    });
    if (item) {
      item.count += 1;
      await item.save();
    } else {
      item = await this.#itemModel.create({
        basketId: basket.id,
        productId,
        count: 1,
      });
    }
    return await this.#basketModel.findByPk(basket.id, {
      include: [
        {
          model: this.#itemModel,
          as: "items",
        },
      ],
    });
  }
  async removeOrDecreaseItem(buyerId, productId, sellerId) {
    if (!buyerId || !productId || !sellerId) {
      throw new Error("buyerId, productId, and sellerId are required");
    }
    const basket = await this.#basketModel.findOne({ where: { buyerId, sellerId } });
    if (!basket) return null;
  
    const item = await this.#itemModel.findOne({ where: { basketId: basket.id, productId } });
    if (!item) return null;
  
    if (item.count > 1) {
      item.count -= 1;
      await item.save();
      return item.count;
    } else {
      await item.destroy();
      const remainingItems = await this.#itemModel.count({ where: { basketId: basket.id } });
      if (remainingItems === 0) {
        await basket.destroy();
      }
      return 0;
    }
  }
  async getAllBaskets(buyerId) {
    const baskets = await this.#basketModel.findAll({
      where: { buyerId },
      attributes: ["id","sellerId"],
      include: [
        {
          model: this.#userModel,
          as: "seller",
          attributes: ["fullname", "username"],
        },
        {
          model: this.#itemModel,
          as: "items",
          attributes: ["count"],
          include: [{
            model: this.#productModel,
            as: "product",
            include: [{ model: this.#ProductDetailModel, as: "details" }],

          }],
        }
      ],
    });
    if (!baskets) return null;
    return baskets;
  }
  async getUserBasketById(basketId, userId) {
    const basket = await this.#basketModel.findOne({
      where: { id: basketId, buyerId: userId },
      include: [
        {
          model: this.#itemModel,
          as: "items",
          attributes: ["id", "count"],
          include: [
            {
              model: this.#productModel,
              as: "product",
              attributes: ["id", "title", "price"],
              include: [
                {
                  model: this.#discountModel,
                  as: "prodictDiscount",
                  attributes: ["id", "type", "amount", "percent"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!basket) {
      return {
        basket: null,
        totalAmount: 0,
        finalAmount: 0,
        totalDiscount: 0,
      };
    }
    let totalAmount = 0;
    let totalDiscount = 0;
    for (const item of basket.items) {
      const price = item.product.price * item.count;
      totalAmount += price;
      if (item.product.discount) {
        const d = item.product.discount;
        let discountValue = 0;
        if (d.type === "product") {
          if (d.percent) discountValue = (price * d.percent) / 100;
          else if (d.amount) discountValue = d.amount;
        } else if (d.type === "basket") {
          if (d.percent) discountValue = (totalAmount * d.percent) / 100;
          else if (d.amount) discountValue = d.amount;
        }
        totalDiscount += discountValue;
      }
    }
    const finalAmount = totalAmount - totalDiscount;
    return {
      basket,
      totalAmount,
      finalAmount,
      totalDiscount,
    };
  }
}
export default new MarketBasketService();