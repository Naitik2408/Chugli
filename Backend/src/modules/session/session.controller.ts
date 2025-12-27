// src/modules/session/session.controller.ts
import type { Request, Response } from "express";
import { SessionService } from "./session.service.js";

const sessionService = new SessionService();

export const createSession = (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const session = sessionService.createSession(username);

  return res.status(201).json(session);
};
