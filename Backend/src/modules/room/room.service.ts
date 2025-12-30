import { randomUUID } from "crypto";
import redis from "../../config/redis.js";
import { SESSION_TTL_SECONDS } from "../../config/ttl.js";
import type { Room } from "./room.types.js";
import { getDistanceInKm } from "../../utils/distance.js";

export class RoomService {
  async createRoom(name: string, lat: number, lng: number): Promise<Room> {
    const roomId = randomUUID();

    const room: Room = {
      roomId,
      name,
      lat,
      lng,
      createdAt: Date.now()
    };

    // store room with TTL
    await redis.set(
      `room:${roomId}`,
      JSON.stringify(room),
      "EX",
      SESSION_TTL_SECONDS
    );

    // add room id to active rooms set
    await redis.sadd("rooms:active", roomId);

    console.log(`✅ Room created: "${name}" (${roomId}) at (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    return room;
  }

  async findNearbyRooms(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<Room[]> {
    const roomIds = await redis.smembers("rooms:active");

    const rooms: Room[] = [];
    const expiredRoomIds: string[] = [];

    for (const roomId of roomIds) {
      const data = await redis.get(`room:${roomId}`);
      if (!data) {
        // Room expired but still in active set - mark for cleanup
        expiredRoomIds.push(roomId);
        continue;
      }

      const room: Room = JSON.parse(data);

      const distance = getDistanceInKm(
        lat,
        lng,
        room.lat,
        room.lng
      );

      if (distance <= radiusKm) {
        rooms.push(room);
      }
    }

    // Clean up expired room IDs from the active set
    if (expiredRoomIds.length > 0) {
      await redis.srem("rooms:active", ...expiredRoomIds);
      console.log(`🧹 Cleaned up ${expiredRoomIds.length} expired room(s)`);
    }

    console.log(`📍 Found ${rooms.length} nearby rooms within ${radiusKm}km of (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    return rooms;
  }

  async joinRoom(roomId: string): Promise<{ roomId: string; status: string }> {
    const data = await redis.get(`room:${roomId}`);

    if (!data) {
      throw new Error("Room not found");
    }

    return {
      roomId,
      status: "joined"
    };
  }
}
