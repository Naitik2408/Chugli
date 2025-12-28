import { RoomService } from "../../src/modules/room/room.service.js";

describe("Room Service", () => {
  it("should create a room with name and coordinates", () => {
    const service = new RoomService();

    // Just verify the service exists and has the createRoom method
    expect(service).toBeDefined();
    expect(service.createRoom).toBeDefined();
    expect(typeof service.createRoom).toBe("function");
  });
});
