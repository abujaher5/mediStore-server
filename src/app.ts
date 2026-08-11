import express, { Application } from "express";
import cors from "cors";

import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { categoryRouter } from "./modules/category/category.route";
import { orderRouter } from "./modules/order/order.route";
import { sellerRouter } from "./modules/seller/seller.route";
import { reviewRouter } from "./modules/review/review.route";
import { customerRouter } from "./modules/customer/customer.route";
import { adminRouter } from "./modules/admin/admin.route.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { userRouter } from "./modules/user/user.route.js";

const app: Application = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/medicines", medicineRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/admin/users", adminRouter);
// app.use("/api", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("Hello From MediStore");
});

app.use(globalErrorHandler);

export default app;
