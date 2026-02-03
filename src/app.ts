import express, { Application } from "express";
import cors from "cors";

import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello From MediStore");
});

app.use(express.json());

export default app;
