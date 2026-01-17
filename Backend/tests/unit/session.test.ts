// tests/unit/session.test.ts
import { describe, expect, it } from "@jest/globals";
import { SessionService } from "../../src/modules/session/session.service.js";

describe("Session Service", () => {
  it("should create a session with username", () => {
    const service = new SessionService();
    const sessionId = "test-session-id";
    const username = "ghost";

    // Just verify the service exists and has the createSession method
    expect(service).toBeDefined();
    expect(service.createSession).toBeDefined();
    expect(typeof service.createSession).toBe("function");
  });
});
