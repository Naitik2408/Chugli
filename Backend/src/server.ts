// src/server.ts
import http from "http";
import app from "./app.js";
import { createSocketServer } from "./config/socket.js";
import { registerSocketHandlers } from "./sockets/index.js";

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = createSocketServer(server);

// Register socket handlers
registerSocketHandlers(io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});