import { Router } from "express";
import { createRoom, getNearbyRooms, joinRoom } from "./room.controller.js";

const router = Router();

router.post("/rooms", createRoom);
router.get("/rooms/nearby", getNearbyRooms);
router.post("/rooms/:roomId/join", joinRoom);

export default router;
