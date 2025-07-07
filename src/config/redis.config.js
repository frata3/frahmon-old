const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await redis.connect();
  console.log("✅ Connected to Redis");
})();

module.exports = redis;
