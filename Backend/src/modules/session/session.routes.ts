// src/modules/session/session.routes.ts
import { Router } from "express";
import { createSession, validateSession } from "./session.controller.js";

const router = Router();

router.post("/session", createSession);
router.get("/session/:sessionId", validateSession);

export default router;
