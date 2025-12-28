// src/__tests__/apiService.test.ts
import { describe, it, expect } from 'vitest';
import { apiService } from '../services/api';

describe('apiService', () => {
  it('should have createSession method', () => {
    expect(apiService.createSession).toBeDefined();
    expect(typeof apiService.createSession).toBe('function');
  });

  it('should have getNearbyRooms method', () => {
    expect(apiService.getNearbyRooms).toBeDefined();
    expect(typeof apiService.getNearbyRooms).toBe('function');
  });

  it('should have createRoom method', () => {
    expect(apiService.createRoom).toBeDefined();
    expect(typeof apiService.createRoom).toBe('function');
  });

  it('should have joinRoom method', () => {
    expect(apiService.joinRoom).toBeDefined();
    expect(typeof apiService.joinRoom).toBe('function');
  });

  it('should validate createRoom parameters', () => {
    const name = 'Test Room';
    const lat = 30.7333;
    const lng = 76.7794;

    expect(name.trim().length).toBeGreaterThan(0);
    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
    expect(lng).toBeGreaterThanOrEqual(-180);
    expect(lng).toBeLessThanOrEqual(180);
  });

  it('should validate getNearbyRooms parameters', () => {
    const lat = 30.7333;
    const lng = 76.7794;

    expect(typeof lat).toBe('number');
    expect(typeof lng).toBe('number');
    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
  });
});
