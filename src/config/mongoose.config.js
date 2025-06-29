// src/config/mongoose.config.js
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to DataBase");
  } catch (err) {
    console.log(err?.message ?? "DB connection failed");
    throw err;
  }
}

module.exports = connectToDB;
