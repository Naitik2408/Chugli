// src/types/index.ts
export interface Room {
  roomId: string;
  name: string;
  lat: number;
  lng: number;
  createdAt: number;
}

export interface Message {
  messageId: string;
  roomId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface User {
  username: string;
  sessionId: string;
}
