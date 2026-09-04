import { Hono } from "hono";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const postRoutes = new Hono();

// Public routes
postRoutes.get("/", getAllPosts);
postRoutes.get("/:id", getPostById);

// Protected routes (User or Admin)
postRoutes.post("/", authMiddleware, createPost);
postRoutes.put("/:id", authMiddleware, updatePost);

// Protected routes (Admin only)
postRoutes.delete("/:id", authMiddleware, adminMiddleware, deletePost);

export default postRoutes;
