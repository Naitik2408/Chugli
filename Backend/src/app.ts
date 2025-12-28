// src/app.ts
import express from "express";
import sessionRoutes from "./modules/session/session.routes.js";
import roomRoutes from "./modules/room/room.routes.js";

const app = express();

app.use(express.json());
app.use(sessionRoutes);
app.use(roomRoutes);

export default app;
