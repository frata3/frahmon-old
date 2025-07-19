import { default as mongoose } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_BLOG_URL);
    console.log("Connected to blogDB via Express");
  } catch (err) {
    console.error("Mongoose DB connection failed :", err?.message ?? err);
    throw err;
  }
}

export default connectToDB;
