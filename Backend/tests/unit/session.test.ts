// tests/unit/session.test.ts
import { SessionService } from "../../src/modules/session/session.service.js";

describe("Session Service", () => {
  it("should create a session with username", async () => {
    const service = new SessionService();
    const session = await service.createSession("ghost");

    expect(session.username).toBe("ghost");
    expect(session.sessionId).toBeDefined();
    expect(session.createdAt).toBeDefined();
    expect(typeof session.sessionId).toBe("string");
    expect(typeof session.createdAt).toBe("number");
  });
});
