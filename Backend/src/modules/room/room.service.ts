import { randomUUID } from "crypto";
import redis from "../../config/redis.js";
import { SESSION_TTL_SECONDS } from "../../config/ttl.js";
import type { Room } from "./room.types.js";

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

    return room;
  }
}
