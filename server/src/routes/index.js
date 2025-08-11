import { Router } from "express";
import authRouter from "./auth.route.js";
import productRouter from "./product.route.js";
import orderRouter from "./order.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);

export default router;