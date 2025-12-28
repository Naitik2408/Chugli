import type { Request, Response } from "express";
import { RoomService } from "./room.service.js";

const roomService = new RoomService();

export const createRoom = async (req: Request, res: Response) => {
  const { name, lat, lng } = req.body;

  if (!name || lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: "name, lat and lng are required"
    });
  }

  const room = await roomService.createRoom(
    name,
    Number(lat),
    Number(lng)
  );

  return res.status(201).json(room);
};

export const getNearbyRooms = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: "lat and lng are required"
    });
  }

  const rooms = await roomService.findNearbyRooms(
    Number(lat),
    Number(lng),
    5
  );

  return res.json(rooms);
};
