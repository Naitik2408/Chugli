// src/utils/storage.ts
// Handles localStorage for session persistence following 2-hour TTL rule

interface StoredSession {
  sessionId: string;
  username: string;
  createdAt: number;
}

interface StoredRoom {
  roomId: string;
  joinedAt: number;
}

const SESSION_KEY = 'chugli_session';
const ROOM_KEY = 'chugli_current_room';
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const storage = {
  // Session management
  saveSession(sessionId: string, username: string): void {
    const session: StoredSession = {
      sessionId,
      username,
      createdAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  getSession(): StoredSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      const session: StoredSession = JSON.parse(raw);
      const age = Date.now() - session.createdAt;
      
      // Check if session expired (2 hours)
      if (age > SESSION_TTL_MS) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.clearRoom(); // clear room too
  },

  // Room management
  saveRoom(roomId: string): void {
    const room: StoredRoom = {
      roomId,
      joinedAt: Date.now(),
    };
    localStorage.setItem(ROOM_KEY, JSON.stringify(room));
  },

  getRoom(): StoredRoom | null {
    const raw = localStorage.getItem(ROOM_KEY);
    if (!raw) return null;

    try {
      const room: StoredRoom = JSON.parse(raw);
      const age = Date.now() - room.joinedAt;
      
      // Room TTL same as session (2 hours)
      if (age > SESSION_TTL_MS) {
        this.clearRoom();
        return null;
      }

      return room;
    } catch {
      this.clearRoom();
      return null;
    }
  },

  clearRoom(): void {
    localStorage.removeItem(ROOM_KEY);
  },
};
