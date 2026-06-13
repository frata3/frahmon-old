import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sequelize.config.js";
import OrderStatus from "../../../common/constant/market/market.order.const.js";

const Order = sequelize.define(
  "order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    paymentId: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.STRING },
    basketId: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.Pending,
    },
    discountId: { type: DataTypes.STRING },
    total_amount: { type: DataTypes.DECIMAL },
    discount_amount: { type: DataTypes.DECIMAL },
    final_amount: { type: DataTypes.DECIMAL },
    address: { type: DataTypes.TEXT },
    reason: { type: DataTypes.STRING, allowNull: true },
  },
  {
    modelName: "order",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
const OrderItems = sequelize.define(
  "order_item",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.STRING(10) },
    count: { type: DataTypes.INTEGER },
  },
  { timestamps: false, modelName: "order_item" }
);
const OrderDiscount = sequelize.define(
  "order_discount",
  {
    orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "orders", key: "id", }, primaryKey: true, onDelete: "CASCADE", },
    discountId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "discounts", key: "id", }, primaryKey: true, onDelete: "CASCADE", },
  },
  {
    tableName: "order_discounts", timestamps: true, createdAt: "created_at", updatedAt: false , id: false,
    indexes: [
      {
        unique: true,
        fields: ["orderId", "discountId"],
      },
    ],
  }
);

export { Order, OrderItems, OrderDiscount };