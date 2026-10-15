const Redis = require("ioredis");

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    connectTimeout: 10000,

    // Upstash compatibility
    enableReadyCheck: false,

    retryStrategy(times) {
      return Math.min(times * 500, 3000);
    },
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redis.on("ready", () => {
    console.log("Redis is ready to use");
  });

  redis.on("error", (error) => {
    console.error("Redis error:", error.message);
  });
} else {
  console.warn("REDIS_URL missing. Redis cache is disabled.");
}

module.exports = redis;