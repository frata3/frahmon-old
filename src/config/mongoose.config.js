const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("Mongoose DB connection failed :", err?.message ?? err);
    throw err;
  }
}

module.exports = connectToDB;
