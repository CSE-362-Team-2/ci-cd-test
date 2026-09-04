import { Hono } from "hono";
import { register, login, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoutes = new Hono();

// Public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// Protected route
authRoutes.get("/me", authMiddleware, getMe);

export default authRoutes;
