import { RoomService } from "../../src/modules/room/room.service.js";

describe("Nearby Room Discovery", () => {
  it("should have findNearbyRooms method", () => {
    const service = new RoomService();

    expect(service).toBeDefined();
    expect(service.findNearbyRooms).toBeDefined();
    expect(typeof service.findNearbyRooms).toBe("function");
  });
});
