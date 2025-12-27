// src/config/redis.ts
import { Redis } from "ioredis";

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
    : new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying
          }
          return Math.min(times * 50, 2000);
        },
      });

export default redis;
