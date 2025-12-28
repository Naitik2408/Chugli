// src/app.ts
import express from "express";
import cors from "cors";
import sessionRoutes from "./modules/session/session.routes.js";
import roomRoutes from "./modules/room/room.routes.js";

const app = express();

// Enable CORS for frontend requests (adjust origin in production as needed)
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));

app.use(express.json());
app.use(sessionRoutes);
app.use(roomRoutes);

export default app;
