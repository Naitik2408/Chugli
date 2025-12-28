import { Server, Socket } from "socket.io";
import { registerRoomSocket } from "./room.socket.js";
import { registerChatSocket } from "./chat.socket.js";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    registerRoomSocket(io, socket);
    registerChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
}
