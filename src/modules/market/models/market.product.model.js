import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sequelize.config.js";
import { nanoid } from "nanoid";
import ProductTypes from "../../../common/constant/market/market.productType.const.js";

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.STRING(10), primaryKey: true, defaultValue: () => nanoid(10) },
    sellerId: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    discountCap: { type: DataTypes.DECIMAL, allowNull: true },
    type: { type: DataTypes.ENUM(...Object.values(ProductTypes)) },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.TEXT },
  },
  {
    modelName: "product",
    tableName: "products",
    timestamps: true,
  }
);
const ProductDetail = sequelize.define(
  "ProductDetail",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "ProductDetail",
    tableName: "product_detail",
    timestamps: false,
  }
);
export { Product, ProductDetail };
