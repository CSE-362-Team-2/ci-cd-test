import { Context } from "hono";
import { PostModel } from "../models/postModel.js";

// CREATE: POST /api/posts
export const createPost = async (c: Context) => {
  try {
    const { title, content, author } = await c.req.json();

    if (!title || !content || !author) {
      return c.json({ error: "Title, content, and author are required" }, 400);
    }

    const newPost = await PostModel.create(title, content, author);
    return c.json({ message: "Post created successfully", post: newPost }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create post" }, 500);
  }
};

// READ: GET /api/posts
// export const getAllPosts = async (c: Context) => {
// };

// UPDATE: PUT /api/posts/:id
// export const updatePost = async (c: Context) => {
// };

// 4. DELETE: DELETE /api/posts/:id
// export const deletePost = async (c: Context) => {
// };
