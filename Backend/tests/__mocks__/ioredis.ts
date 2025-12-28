// tests/__mocks__/ioredis.ts
export default class Redis {
  set = jest.fn().mockResolvedValue("OK");
}
