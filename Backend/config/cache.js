
const redis = require("./redis");

const CACHE_PREFIX = "globalscion:cache:";

const cacheMiddleware = (ttl = 60) => {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    if (!redis) {
      res.set("X-Cache", "BYPASS");
      return next();
    }

    const cacheKey = `${CACHE_PREFIX}${req.originalUrl}`;

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        const result = JSON.parse(cached);

        res.set("X-Cache", "HIT");
        return res.status(result.status).json(result.data);
      }
    } catch (error) {
      console.error("Redis cache read error:", error.message);
      res.set("X-Cache", "BYPASS");
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (data) => {
      if (res.statusCode === 200) {
        redis
          .set(
            cacheKey,
            JSON.stringify({
              status: res.statusCode,
              data,
            }),
            "EX",
            ttl
          )
          .catch((error) => {
            console.error("Redis cache write error:", error.message);
          });
      }

      res.set("X-Cache", "MISS");
      return originalJson(data);
    };

    return next();
  };
};

const clearCache = async () => {
  if (!redis) return;

  try {
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `${CACHE_PREFIX}*`,
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis cache clear error:", error.message);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
