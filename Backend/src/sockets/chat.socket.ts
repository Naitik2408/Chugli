import { Server, Socket } from "socket.io";

export function registerChatSocket(io: Server, socket: Socket) {
  socket.on("send_message", ({ roomId, message }) => {
    if (!roomId || !message) {
      socket.emit("error", {
        message: "roomId and message are required"
      });
      return;
    }

    const payload = {
      message,
      timestamp: Date.now(),
      senderId: socket.id
    };

    io.to(roomId).emit("receive_message", payload);
  });
}
