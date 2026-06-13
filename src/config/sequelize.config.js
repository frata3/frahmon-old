import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESQL_MARKET_URL, {
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: true,
  },
});

async function connectToMarketDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL via Sequelize");
  } catch (error) {
    console.error("Sequelize DB connection failed:", error?.message ?? error);
    throw error;
  }
}

export { connectToMarketDB, sequelize };
