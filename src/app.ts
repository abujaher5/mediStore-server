import express, { Application } from "express";
import cors from "cors";

import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { categoryRouter } from "./modules/category/category.route";
import { userRouter } from "./modules/user/user.route";
import { orderRouter } from "./modules/order/order.route";
import { sellerRouter } from "./modules/seller/seller.route";

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
app.use("/api/seller", sellerRouter);
app.use("/api", categoryRouter);
app.use("/api/admin/users", userRouter);
app.use("/api", userRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello From MediStore");
});

export default app;
