import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sequelize.config.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.STRING, primaryKey: true },
  username: DataTypes.STRING,
  fullname: DataTypes.STRING,
  avatar: { type: DataTypes.STRING, defaultValue: "/assets/pictures/default-avatar.png" },
}, {
  tableName: "users",
  timestamps: false,
});

export default User;