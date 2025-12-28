import { Router } from "express";
import { createRoom } from "./room.controller.js";

const router = Router();

router.post("/rooms", createRoom);

export default router;
