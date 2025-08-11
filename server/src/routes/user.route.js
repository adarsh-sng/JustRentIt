import { Router } from "express";
import { register, login, logout, getMe, refreshToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.post("/refresh-token", refreshToken);

export default router;