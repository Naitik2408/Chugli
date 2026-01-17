import { Server, Socket } from "socket.io";
import redis from "../config/redis.js";

export function registerRoomSocket(io: Server, socket: Socket) {
  socket.on("join_room", async ({ roomId, username }) => {
    if (!roomId) {
      socket.emit("error", { message: "roomId is required" });
      return;
    }

    const roomExists = await redis.get(`room:${roomId}`);

    if (!roomExists) {
      socket.emit("error", { message: "Room not found or expired", code: "ROOM_EXPIRED" });
      return;
    }

    // store username on the socket for later use
    if (username) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      socket.data = socket.data || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      socket.data.username = username;
    }

    socket.join(roomId);

    // Load message history from Redis (last 50 messages)
    const messageKeys = await redis.lrange(`room:${roomId}:messages`, 0, 49);
    const messages = [];
    for (const key of messageKeys) {
      try {
        const msg = JSON.parse(key);
        messages.push(msg);
      } catch {
        // skip invalid messages
      }
    }

    socket.emit("joined_room", {
      roomId,
      status: "joined",
      username: username || null,
      messages: messages.reverse() // reverse so oldest first
    });

    console.log(`👤 Socket ${socket.id} joined room ${roomId} (loaded ${messages.length} messages)`);
  });

  socket.on("leave_room", ({ roomId }) => {
    if (roomId) {
      socket.leave(roomId);
      console.log(`👋 Socket ${socket.id} left room ${roomId}`);
    }
  });
}
