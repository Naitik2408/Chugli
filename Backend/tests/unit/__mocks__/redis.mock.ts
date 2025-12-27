export const mockRedis = {
  set: async () => "OK",
  get: async () => null,
  del: async () => 1,
  quit: async () => "OK",
};
