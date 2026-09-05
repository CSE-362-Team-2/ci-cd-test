import { Hono } from "hono";
import {
  register,
  login,
  getMe,
  getAdminData,
  getAllUsers,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const authRoutes = new Hono();

// public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// protected routes - authentication required
authRoutes.get("/me", authMiddleware, getMe);
authRoutes.get("/profile", authMiddleware, getMe);

// RBAC - admin only
authRoutes.get("/admin", authMiddleware, authorize("admin"), getAdminData);
authRoutes.get("/users", authMiddleware, authorize("admin"), getAllUsers);

export default authRoutes;
