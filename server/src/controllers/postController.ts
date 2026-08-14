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

// READ: GET /api/posts - Get all posts
export const getAllPosts = async (c: Context) => {
  try {
    const posts = await PostModel.findAll();
    return c.json({ posts, count: posts.length }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ 
      errCode: 500, 
      errMsg: "Failed to fetch posts" 
    }, 500);
  }
};

// READ: GET /api/posts/:id - Get single post
export const getPostById = async (c: Context) => {
  try {
    const idParam = c.req.param("id");
    
    if (!idParam || idParam.trim() === "") {
      return c.json({ 
        errCode: 130, 
        errMsg: "`id` is required for this request" 
      }, 400);
    }
    
    const id = parseInt(idParam);
    if (isNaN(id) || id <= 0) {
      return c.json({ 
        errCode: 132, 
        errMsg: "`id` must be a valid positive number" 
      }, 400);
    }
    
    const post = await PostModel.findById(id);
    if (!post) {
      return c.json({ 
        errCode: 131, 
        errMsg: "Post not found" 
      }, 404);
    }
    
    return c.json({ post }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ 
      errCode: 500, 
      errMsg: "Failed to fetch post" 
    }, 500);
  }
};

// UPDATE: PUT /api/posts/:id
// export const updatePost = async (c: Context) => {
// };

// 4. DELETE: DELETE /api/posts/:id
// export const deletePost = async (c: Context) => {
// };
