import { Server, Socket } from "socket.io";
import redis from "../config/redis.js";
import { SESSION_TTL_SECONDS } from "../config/ttl.js";

// Simple rate limiting: track last message timestamp per socket
const lastMessageTime = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // 1 message per second

export function registerChatSocket(io: Server, socket: Socket) {
  socket.on("send_message", async ({ roomId, message }) => {
    if (!roomId || !message) {
      socket.emit("error", {
        message: "roomId and message are required"
      });
      return;
    }

    // Rate limiting check
    const now = Date.now();
    const lastTime = lastMessageTime.get(socket.id) || 0;
    if (now - lastTime < RATE_LIMIT_MS) {
      socket.emit("error", {
        message: "Too many messages. Please wait a moment.",
        code: "RATE_LIMIT"
      });
      return;
    }
    lastMessageTime.set(socket.id, now);

    // Message length limit (300 chars)
    if (message.length > 300) {
      socket.emit("error", {
        message: "Message too long (max 300 characters)",
        code: "MESSAGE_TOO_LONG"
      });
      return;
    }

    // try to include username if it was set during join
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const username = (socket.data && socket.data.username) || null;

    const payload = {
      message,
      timestamp: Date.now(),
      senderId: socket.id,
      username,
      roomId
    };

    // Store message in Redis (keep last 50 messages per room)
    try {
      await redis.lpush(`room:${roomId}:messages`, JSON.stringify(payload));
      await redis.ltrim(`room:${roomId}:messages`, 0, 49); // keep only 50 messages
      await redis.expire(`room:${roomId}:messages`, SESSION_TTL_SECONDS); // same TTL as room
    } catch (err) {
      console.error('Failed to store message in Redis:', err);
    }

    // Broadcast message only to users in this specific room
    io.to(roomId).emit("receive_message", payload);
  });

  // Clean up rate limit on disconnect
  socket.on("disconnect", () => {
    lastMessageTime.delete(socket.id);
  });
}
