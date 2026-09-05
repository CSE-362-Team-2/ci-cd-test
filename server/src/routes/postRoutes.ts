import { Hono } from "hono";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const postRoutes = new Hono();

// Public routes
postRoutes.get("/", getAllPosts);
postRoutes.get("/:id", getPostById);

// Protected routes (User or Admin)
postRoutes.post("/", createPost);
postRoutes.put("/:id", updatePost);

// Protected routes (Admin only)
postRoutes.delete("/:id", deletePost);

export default postRoutes;
