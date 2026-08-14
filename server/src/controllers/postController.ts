import { Context } from "hono";
import { PostModel } from "../models/postModel.js";

// CREATE: POST /api/posts
export const createPost = async (c: Context) => {
  try {
    const { title, content, author } = await c.req.json();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanAuthor = author.trim();

    if (!cleanTitle || !cleanContent || !cleanAuthor) {
      return c.json(
        { success: false, error: "Title, content, and author are required" },
        400,
      );
    }

    const newPost = await PostModel.create(
      cleanTitle,
      cleanContent,
      cleanAuthor,
    );
    return c.json(
      { success: true, message: "Post created successfully", post: newPost },
      201,
    );
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: "Failed to create post" }, 500);
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
