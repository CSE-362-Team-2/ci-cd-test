import { Hono } from "hono";



import { createPost, getAllPosts, getPostById, deletePost } from "../controllers/postController.js";

const postRoutes = new Hono();

// CREATE
postRoutes.post("/", createPost);
// READ
postRoutes.get("/", getAllPosts);
postRoutes.get("/:id", getPostById);
// UPDATE
postRoutes.put("/:id", updatePost);
// DELETE
postRoutes.delete("/:id", deletePost);

export default postRoutes;
