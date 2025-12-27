// src/modules/session/session.routes.ts
import { Router } from "express";
import { createSession } from "./session.controller.js";

const router = Router();

router.post("/session", createSession);

export default router;
