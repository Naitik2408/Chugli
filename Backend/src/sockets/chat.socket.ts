import { Server, Socket } from "socket.io";

// Simple rate limiting: track last message timestamp per socket
const lastMessageTime = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // 1 message per second

export function registerChatSocket(io: Server, socket: Socket) {
  socket.on("send_message", ({ roomId, message }) => {
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

    io.to(roomId).emit("receive_message", payload);
  });

  // Clean up rate limit on disconnect
  socket.on("disconnect", () => {
    lastMessageTime.delete(socket.id);
  });
}
