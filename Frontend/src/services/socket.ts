// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private errorCallback: ((error: { message: string }) => void) | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        if (this.errorCallback) {
          this.errorCallback(error);
        }
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
    this.socket?.emit('join_room', { roomId, username });
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', { roomId });
  }

  sendMessage(roomId: string, _username: string, text: string) {
    // backend expects { roomId, message } - username comes from socket.data on backend
    this.socket?.emit('send_message', { roomId, message: text });
  }

  onRoomJoined(callback: (data: { roomId: string; username?: string }) => void) {
    this.socket?.on('joined_room', callback);
  }

  onRoomLeft(callback: (data: { roomId: string; username?: string }) => void) {
    this.socket?.on('room:left', callback);
  }

  onMessage(callback: (message: Message) => void) {
    // backend emits payload: { message, timestamp, senderId, username, roomId }
    this.socket?.on('receive_message', (payload: any) => {
      const mapped: Message = {
        messageId: `${payload.senderId || 's'}_${payload.timestamp}`,
        roomId: payload.roomId || '',
        username: payload.username || payload.senderId || 'unknown',
        text: payload.message || payload.text || '',
        timestamp: payload.timestamp || Date.now(),
      };
      callback(mapped);
    });
  }

  offRoomJoined() {
    this.socket?.off('room:joined');
  }

  offRoomLeft() {
    this.socket?.off('room:left');
  }

  offMessage() {
    this.socket?.off('receive_message');
  }

  onError(callback: (error: { message: string }) => void) {
    this.errorCallback = callback;
  }

  offError() {
    this.errorCallback = null;
  }
}

export const socketService = new SocketService();
