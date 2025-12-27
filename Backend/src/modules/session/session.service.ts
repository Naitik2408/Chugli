// src/modules/session/session.service.ts
import { randomUUID } from "crypto";
import type { SessionData } from "./session.types.js";

export class SessionService {
  createSession(username: string): SessionData {
    const sessionId = randomUUID();

    return {
      sessionId,
      username,
      createdAt: Date.now(),
    };
  }
}
