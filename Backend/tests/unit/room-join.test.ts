import { RoomService } from "../../src/modules/room/room.service.js";

describe("Join Room", () => {
  it("should have joinRoom method", () => {
    const service = new RoomService();

    expect(service).toBeDefined();
    expect(service.joinRoom).toBeDefined();
    expect(typeof service.joinRoom).toBe("function");
  });
});
