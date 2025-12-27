// src/config/__mocks__/redis.ts
const mockRedis = {
  set: async () => "OK",
  get: async () => null,
  del: async () => 1,
  quit: async () => "OK",
  disconnect: () => {},
  connect: async () => {},
};

export default mockRedis;
