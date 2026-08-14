import { Hono } from "hono";
import { createPost, deletePost } from "../controllers/postController.js";

const postRoutes = new Hono();

// CREATE
postRoutes.post("/", createPost);
// READ
// postRoutes.get("/", getAllPosts);
// UPDATE
// postRoutes.put("/:id", updatePost);
// DELETE
postRoutes.delete("/:id", deletePost);

export default postRoutes;
