import { Server, Socket } from "socket.io";
import redis from "../config/redis.js";

export function registerRoomSocket(io: Server, socket: Socket) {
  socket.on("join_room", async ({ roomId }) => {
    if (!roomId) {
      socket.emit("error", { message: "roomId is required" });
      return;
    }

    const roomExists = await redis.get(`room:${roomId}`);

    if (!roomExists) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    socket.join(roomId);

    socket.emit("joined_room", {
      roomId,
      status: "joined"
    });

    console.log(`👤 Socket ${socket.id} joined room ${roomId}`);
  });
}
