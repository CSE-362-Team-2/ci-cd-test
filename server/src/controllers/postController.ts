import type { Context } from "hono";
import { PostModel } from "../models/postModel.js";

// CREATE: POST /api/posts - Protected (User/Admin)
export const createPost = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }

    const { title, content, author } = await c.req.json();
    const cleanTitle = title?.trim() || "";
    const cleanContent = content?.trim() || "";
    const cleanAuthor = author?.trim() || user.username || "Anonymous";

    if (!cleanTitle) {
      return c.json({ errCode: 100, errMsg: "Title is required" }, 400);
    }
    if (!cleanContent) {
      return c.json({ errCode: 101, errMsg: "Content is required" }, 400);
    }

    const newPost = await PostModel.create(
      cleanTitle,
      cleanContent,
      cleanAuthor,
      user.id
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

// READ: GET /api/posts - Public
export const getAllPosts = async (c: Context) => {
  try {
    const posts = await PostModel.findAll();
    return c.json({ posts, count: posts.length }, 200);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        errCode: 110,
        errMsg: "Failed to fetch posts",
      },
      500,
    );
  }
};

// READ: GET /api/posts/:id - Public
export const getPostById = async (c: Context) => {
  try {
    const idParam = c.req.param("id");
    if (!idParam || idParam.trim() === "") {
      return c.json(
        {
          errCode: 111,
          errMsg: "`id` is required for this request",
        },
        400,
      );
    }

    const id = parseInt(idParam);
    if (isNaN(id) || id <= 0) {
      return c.json(
        {
          errCode: 112,
          errMsg: "`id` must be a valid positive number",
        },
        400,
      );
    }

    const post = await PostModel.findById(id);
    if (!post) {
      return c.json(
        {
          errCode: 113,
          errMsg: "Post not found",
        },
        404,
      );
    }

    return c.json({ post }, 200);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        errCode: 110,
        errMsg: "Failed to fetch post",
      },
      500,
    );
  }
};

// UPDATE: PUT /api/posts/:id - Protected (Owner or Admin)
export const updatePost = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }

    const idParam = c.req.param("id");
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      return c.json(
        {
          errCode: 140,
          errMsg: "Invalid post ID",
        },
        400,
      );
    }

    const { title, content } = await c.req.json();
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanContent = typeof content === "string" ? content.trim() : "";

    if (!cleanTitle) {
      return c.json(
        {
          errCode: 141,
          errMsg: "Title is required for updating",
        },
        400,
      );
    }
    if (!cleanContent) {
      return c.json(
        {
          errCode: 142,
          errMsg: "Content is required for updating",
        },
        400,
      );
    }

    // Check if post exists
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      return c.json(
        {
          errCode: 143,
          errMsg: "Post not found",
        },
        404,
      );
    }

    // Authorization: Only owner or admin can update
    if (existingPost.user_id !== user.id && user.role !== "admin") {
      return c.json(
        {
          errCode: 145,
          errMsg: "Forbidden: You can only update your own posts",
        },
        403,
      );
    }

    const updatedPost = await PostModel.update(id, cleanTitle, cleanContent);
    return c.json(
      {
        message: "Post updated successfully",
        post: updatedPost,
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        errCode: 144,
        errMsg: "Failed to update post due to internal server error",
      },
      500,
    );
  }
};

// DELETE: DELETE /api/posts/:id - Protected (Admin only)
export const deletePost = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }

    // Only admin can delete
    if (user.role !== "admin") {
      return c.json(
        {
          errCode: 146,
          errMsg: "Forbidden: Admin access required to delete posts",
        },
        403,
      );
    }

    const idParam = c.req.param("id");
    if (!idParam || idParam.trim() === "") {
      return c.json(
        { errCode: 130, errMsg: "`id` is required for this request" },
        400,
      );
    }

    const id = parseInt(idParam);
    if (isNaN(id) || id <= 0) {
      return c.json(
        { errCode: 131, errMsg: "`id` must be a valid positive number" },
        400,
      );
    }

    const deleted = await PostModel.delete(id);
    if (!deleted) {
      return c.json(
        { errCode: 132, errMsg: "Post not found" },
        404,
      );
    }

    return c.json({ message: "Post deleted successfully", id }, 200);
  } catch (error) {
    console.error(error);
    return c.json(
      { errCode: 133, errMsg: "Failed to delete post" },
      500,
    );
  }
};
