import { Context } from "hono";
import { PostModel } from "../models/postModel.js";

// CREATE: POST /api/posts
export const createPost = async (c: Context) => {
  try {
    const { title, content, author } = await c.req.json();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanAuthor = author.trim();

    if (!cleanTitle) {
      return c.json({ errCode: 100, errMsg: "Title is required" }, 400);
    } else if (!cleanContent) {
      return c.json({ errCode: 101, errMsg: "Content is required" }, 400);
    } else if (!cleanAuthor) {
      return c.json({ errCode: 102, errMsg: "Author is required" }, 400);
    }

    const newPost = await PostModel.create(
      cleanTitle,
      cleanContent,
      cleanAuthor,
    );
    return c.json({ message: "Post created successfully", post: newPost }, 201);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        errCode: 104,
        errMsg: "Failed to create post due to internal server error",
      },
      500,
    );
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
