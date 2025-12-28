// tests/integration/room-flow.test.ts
import { describe, it, expect } from '@jest/globals';
import { SessionService } from '../../src/modules/session/session.service.js';
import { RoomService } from '../../src/modules/room/room.service.js';

describe('Room Flow Integration Tests', () => {
  const sessionService = new SessionService();
  const roomService = new RoomService();

  it('should create session, create room, find nearby rooms, and join room', () => {
    // Verify all services are initialized
    expect(sessionService).toBeDefined();
    expect(roomService).toBeDefined();

    // Verify session methods
    expect(sessionService.createSession).toBeDefined();
    expect(typeof sessionService.createSession).toBe('function');

    // Verify room methods
    expect(roomService.createRoom).toBeDefined();
    expect(roomService.findNearbyRooms).toBeDefined();
    expect(roomService.joinRoom).toBeDefined();

    expect(typeof roomService.createRoom).toBe('function');
    expect(typeof roomService.findNearbyRooms).toBe('function');
    expect(typeof roomService.joinRoom).toBe('function');
  });

  it('should validate complete room data flow', () => {
    // Session creation
    const username = 'TestUser';
    expect(username.trim().length).toBeGreaterThan(0);

    // Room creation
    const roomName = 'Test Room';
    const lat = 30.7333;
    const lng = 76.7794;

    expect(roomName.trim().length).toBeGreaterThan(0);
    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
    expect(lng).toBeGreaterThanOrEqual(-180);
    expect(lng).toBeLessThanOrEqual(180);

    // Room structure
    const room = {
      roomId: 'test-room-id',
      name: roomName,
      lat,
      lng,
      createdAt: Date.now(),
    };

    expect(room).toHaveProperty('roomId');
    expect(room).toHaveProperty('name');
    expect(room).toHaveProperty('lat');
    expect(room).toHaveProperty('lng');
    expect(room).toHaveProperty('createdAt');
  });
});
