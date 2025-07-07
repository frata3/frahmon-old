const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRESQL_FORUM_URL,
    },
  },
});

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("Prisma DB connection failed:", err?.message ?? err);
    throw err;
  }
}

module.exports = { connectToDB, prisma };
