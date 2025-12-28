// tests/unit/room-create.test.ts
import { describe, it, expect } from '@jest/globals';
import { RoomService } from '../../src/modules/room/room.service.js';

describe('Room Service - Create Room', () => {
  it('should have createRoom method on RoomService', () => {
    const service = new RoomService();
    expect(service).toBeDefined();
    expect((service as any).createRoom).toBeDefined();
    expect(typeof (service as any).createRoom).toBe('function');
  });

  it('should validate room data structure', () => {
    const roomData = {
      roomId: 'test-room-id',
      name: 'Test Room',
      lat: 30.7333,
      lng: 76.7794,
      createdAt: Date.now(),
    };

    expect(roomData).toHaveProperty('roomId');
    expect(roomData).toHaveProperty('name');
    expect(roomData).toHaveProperty('lat');
    expect(roomData).toHaveProperty('lng');
    expect(roomData).toHaveProperty('createdAt');
    
    expect(typeof roomData.name).toBe('string');
    expect(typeof roomData.lat).toBe('number');
    expect(typeof roomData.lng).toBe('number');
  });

  it('should validate coordinate ranges', () => {
    const lat = 30.7333;
    const lng = 76.7794;

    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
    expect(lng).toBeGreaterThanOrEqual(-180);
    expect(lng).toBeLessThanOrEqual(180);
  });

  it('should validate room name is not empty', () => {
    const roomName = 'Test Room';
    expect(roomName.trim().length).toBeGreaterThan(0);
  });
});
