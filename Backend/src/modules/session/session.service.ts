// src/modules/session/session.service.ts
import { randomUUID } from "crypto";
import redis from "../../config/redis.js";
import { SESSION_TTL_SECONDS } from "../../config/ttl.js";
import type { SessionData } from "./session.types.js";

export class SessionService {
  async createSession(username: string): Promise<SessionData> {
    const sessionId = randomUUID();

    const session: SessionData = {
      sessionId,
      username,
      createdAt: Date.now()
    };

    // Store in Redis with TTL
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(session),
      "EX",
      SESSION_TTL_SECONDS
    );

    return session;
  }
}
