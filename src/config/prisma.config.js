import  {PrismaClient}  from '@prisma/client';
import dotenv from 'dotenv';
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

export { connectToDB, prisma };
