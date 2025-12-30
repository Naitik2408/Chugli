// src/modules/session/session.controller.ts
import type { Request, Response } from "express";
import { SessionService } from "./session.service.js";

const sessionService = new SessionService();

export const createSession = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const session = await sessionService.createSession(username);
    return res.status(201).json(session);
  } catch (err: any) {
    console.error("Failed to create session:", err);
    // If Redis is unavailable, return a 503 so clients can retry later
    return res
      .status(503)
      .json({ error: "Service unavailable. Please try again later." });
  }
};

export const validateSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  const session = await sessionService.getSession(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found or expired" });
  }

  return res.json(session);
};

export const deleteSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const ok = await sessionService.deleteSession(sessionId);
    if (ok) return res.status(200).json({ status: 'deleted' });
    return res.status(404).json({ error: 'Session not found' });
  } catch (err: any) {
    console.error('Failed to delete session:', err);
    return res.status(503).json({ error: 'Service unavailable' });
  }
};
