// src/modules/session/session.controller.ts
import type { Request, Response } from "express";
import { SessionService } from "./session.service.js";

const sessionService = new SessionService();

export const createSession = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const session = await sessionService.createSession(username);

  return res.status(201).json(session);
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
