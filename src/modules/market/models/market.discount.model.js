import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sequelize.config.js";

const Discount = sequelize.define(
  "discount",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sellerId: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("basket", "product") },
    targetId: { type: DataTypes.STRING, allowNull: false },
    mode: { type: DataTypes.ENUM("auto", "code") },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    code: { type: DataTypes.STRING },
    amount: { type: DataTypes.INTEGER },
    percent: { type: DataTypes.INTEGER },
    limit: { type: DataTypes.INTEGER, allowNull: true },
    usage: { type: DataTypes.INTEGER, allowNull: true },
    expires_in: { type: DataTypes.DATE, allowNull: true },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    modelName: "discount",
  }
);

export default Discount;