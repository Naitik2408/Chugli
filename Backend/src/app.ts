// src/app.ts
import express from "express";
import sessionRoutes from "./modules/session/session.routes.js";

const app = express();

app.use(express.json());
app.use(sessionRoutes);

export default app;
