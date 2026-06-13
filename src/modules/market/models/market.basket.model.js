import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sequelize.config.js";

const Basket = sequelize.define(
  "basket",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buyerId: { type: DataTypes.STRING },
    sellerId: { type: DataTypes.STRING, allowNull: false },
    discountId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { timestamps: false, modelName: "basket" }
);
const BasketItem = sequelize.define(
  "basketItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    basketId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.STRING(10) },
    count: { type: DataTypes.INTEGER },
    discountId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { timestamps: false, modelName: "basket" }
);
export { Basket, BasketItem };
