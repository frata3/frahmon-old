const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const seedDatabase = require("../common/middleware/seed");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to DataBase");
    seedDatabase();
  })
  .catch((err) => {
    console.log(err?.message ?? "DB connection failed");
  });
