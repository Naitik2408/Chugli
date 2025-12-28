// src/services/api.ts
import axios from 'axios';
import type { Room, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Create session
  createSession: async (username: string): Promise<User> => {
    const { data } = await api.post('/session', { username });
    return data;
  },

  // Get nearby rooms
  getNearbyRooms: async (lat: number, lng: number): Promise<Room[]> => {
    const { data } = await api.get('/rooms/nearby', {
      params: { lat, lng },
    });
    return data;
  },

  // Create room
  createRoom: async (name: string, lat: number, lng: number): Promise<Room> => {
    const { data } = await api.post('/rooms', { name, lat, lng });
    return data;
  },

  // Join room
  joinRoom: async (roomId: string): Promise<{ roomId: string; status: string }> => {
    const { data } = await api.post(`/rooms/${roomId}/join`);
    return data;
  },
};
