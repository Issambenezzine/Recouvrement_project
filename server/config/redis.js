
const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  // Add password if needed: password: process.env.REDIS_PASSWORD
});


async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected");
}

// call once when server starts
connectRedis();

// Connect to Redis
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;