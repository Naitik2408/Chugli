import { Router } from "express";
import { createRoom, getNearbyRooms } from "./room.controller.js";

const router = Router();

router.post("/rooms", createRoom);
router.get("/rooms/nearby", getNearbyRooms);

export default router;
