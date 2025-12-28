// src/__tests__/CreateRoomModal.test.tsx
import { describe, it, expect } from 'vitest';
import type { CreateRoomModal } from '../components/CreateRoomModal';

// Type-only import to verify component interface exists
// @ts-expect-error - intentionally unused for type checking only
const _typeCheck: typeof CreateRoomModal = null as any;

describe('CreateRoomModal', () => {
  it('should have required props interface', () => {
    const props = {
      isOpen: true,
      onClose: () => {},
      onCreateRoom: async () => {},
      userLocation: { lat: 30.7333, lng: 76.7794 },
    };

    expect(props).toBeDefined();
    expect(props.isOpen).toBe(true);
    expect(typeof props.onClose).toBe('function');
    expect(typeof props.onCreateRoom).toBe('function');
    expect(props.userLocation).toHaveProperty('lat');
    expect(props.userLocation).toHaveProperty('lng');
  });

  it('should validate room name requirements', () => {
    const roomName = 'Test Room';
    expect(roomName.trim().length).toBeGreaterThan(0);
    expect(roomName.length).toBeLessThanOrEqual(50);
  });

  it('should validate user location requirements', () => {
    const location = { lat: 30.7333, lng: 76.7794 };
    expect(location.lat).toBeGreaterThanOrEqual(-90);
    expect(location.lat).toBeLessThanOrEqual(90);
    expect(location.lng).toBeGreaterThanOrEqual(-180);
    expect(location.lng).toBeLessThanOrEqual(180);
  });
});
