import express, { Application } from "express";
import cors from "cors";

import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { medicineRouter } from "./modules/medicine/medicine.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/medicines", medicineRouter);
app.use("/api/seller/medicines", medicineRouter);

app.get("/", (req, res) => {
  res.send("Hello From MediStore");
});

export default app;
