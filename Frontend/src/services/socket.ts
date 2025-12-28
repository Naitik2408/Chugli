// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string, username: string) {
    this.socket?.emit('room:join', { roomId, username });
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', { roomId });
  }

  sendMessage(roomId: string, username: string, text: string) {
    this.socket?.emit('chat:message', { roomId, username, text });
  }

  onRoomJoined(callback: (data: { roomId: string; username: string }) => void) {
    this.socket?.on('room:joined', callback);
  }

  onRoomLeft(callback: (data: { roomId: string; username: string }) => void) {
    this.socket?.on('room:left', callback);
  }

  onMessage(callback: (message: Message) => void) {
    this.socket?.on('chat:message', callback);
  }

  offRoomJoined() {
    this.socket?.off('room:joined');
  }

  offRoomLeft() {
    this.socket?.off('room:left');
  }

  offMessage() {
    this.socket?.off('chat:message');
  }
}

export const socketService = new SocketService();
