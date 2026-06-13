import { sequelize } from "./sequelize.config.js";
import {
  Product,
  ProductDetail,
} from "../modules/market/models/market.product.model.js";
import {
  Basket,
  BasketItem,
} from "../modules/market/models/market.basket.model.js";
import User from "../modules/market/models/market.user.model.js";
import Discount from "../modules/market/models/market.discount.model.js";
import {
  Order,
  OrderItems,
  OrderDiscount
} from "../modules/market/models/market.order.model.js";
import Payment from "../modules/market/models/market.payment.model.js";

Product.hasOne(ProductDetail, { foreignKey: "productId", as: "details" });
ProductDetail.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Product, { foreignKey: "sellerId", sourceKey: "id", as: "products" });
Product.belongsTo(User, { foreignKey: "sellerId", targetKey: "id", as: "seller" });

Product.hasMany(BasketItem, { foreignKey: "productId", as: "basketItems" });
BasketItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Basket.hasMany(BasketItem, { foreignKey: "basketId", as: "items" });
BasketItem.belongsTo(Basket, { foreignKey: "basketId", as: "basket" });

Order.hasOne(Basket, { foreignKey: "basketId", as: "order" });
Basket.belongsTo(Order, { foreignKey: "basketId" });

User.hasMany(Basket, { foreignKey: "buyerId", sourceKey: "id", as: "buyerBasket", });
Basket.belongsTo(User, { foreignKey: "buyerId", targetKey: "id", as: "buyer" });

User.hasMany(Basket, { foreignKey: "sellerId", as: "sellerBasket" });
Basket.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

Order.hasMany(OrderItems, { foreignKey: "orderId", as: "items" });
OrderItems.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItems, { foreignKey: "productId" });
OrderItems.belongsTo(Product, { foreignKey: "productId", as: "product" });

Order.hasOne(Payment, { foreignKey: "orderId", as: "payment" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

Order.belongsToMany(Discount, { through: "order_discounts", as: "discounts", foreignKey: "orderId", });
Discount.belongsToMany(Order, { through: "order_discounts", as: "orders", foreignKey: "discountId", });

Discount.hasMany(Basket, { foreignKey: "discountId", as: "baskets" });
Basket.belongsTo(Discount, { foreignKey: "discountId", as: "basketDiscount" });

Discount.hasMany(Product, { foreignKey: "discountId", as: "products" });
Product.belongsTo(Discount, { foreignKey: "discountId", as: "prodictDiscount" });

export async function syncSequelizeModels() {
  try {
    await sequelize.sync({
      alter: true,
      // force: true
    });
    console.log("All Sequelize models synced.");
  } catch (err) {
    console.error("Sequelize sync error:", err);
  }
}
// export { Product, ProductDetail };
