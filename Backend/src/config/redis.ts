// src/config/redis.ts
import * as IORedisPkg from "ioredis";
import type { Redis } from "ioredis";

// ioredis can export either a constructor as the default or as the module itself
// depending on how it's compiled. Normalize to a runtime constructor safely.
const IORedisCtor: any = (IORedisPkg as any).default ?? IORedisPkg;

// Create a mock Redis client for testing
const createMockRedis = () => ({
  set: async () => "OK",
  get: async () => null,
  del: async () => 1,
  quit: async () => "OK",
  disconnect: () => {},
  connect: async () => {},
});

// Use mock Redis in test environment
const redis =
  process.env.NODE_ENV === "test"
    ? (createMockRedis() as unknown as Redis)
    : ((): Redis => {
        // Prefer a full REDIS_URL when provided (works with managed providers)
        const url = process.env.REDIS_URL;
        if (url) {
          const client = new IORedisCtor(url) as unknown as Redis;
          client.on("error", (err: any) => console.error("Redis error:", err));
          return client;
        }

        const opts: any = {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: Number(process.env.REDIS_PORT) || 6379,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryStrategy: (times: number) => {
            if (times > 3) {
              return null; // Stop retrying
            }
            return Math.min(times * 50, 2000);
          },
        };

        if (process.env.REDIS_PASSWORD) {
          opts.password = process.env.REDIS_PASSWORD;
        }

        // Support TLS for providers that require it (set REDIS_TLS=true)
        if (process.env.REDIS_TLS === "true") {
          opts.tls = { servername: process.env.REDIS_HOST };
        }

        const client = new IORedisCtor(opts) as unknown as Redis;
        client.on("error", (err: any) => console.error("Redis error:", err));
        client.on("connect", () => console.log("✅ Redis connected"));
        client.on("ready", () => console.log("✅ Redis ready"));
        return client;
      })();

// Connect to Redis on startup (lazyConnect is true, so we trigger it here)
if (process.env.NODE_ENV !== "test") {
  redis.connect().catch((err) => {
    console.error("❌ Failed to connect to Redis:", err.message);
    console.error("Make sure Redis is running: redis-server");
  });
}

export default redis;
