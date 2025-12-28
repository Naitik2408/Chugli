import { Server } from "socket.io";
import http from "http";

export function createSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // later restrict for production
      methods: ["GET", "POST"]
    }
  });

  return io;
}
