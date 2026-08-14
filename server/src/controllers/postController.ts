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

// READ: GET /api/posts - Get all posts
export const getAllPosts = async (c: Context) => {
  try {
    const posts = await PostModel.findAll();
    return c.json({ posts, count: posts.length }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ 
      errCode: 110, 
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
        errCode: 111, 
        errMsg: "`id` is required for this request" 
      }, 400);
    }
    
    const id = parseInt(idParam);
    if (isNaN(id) || id <= 0) {
      return c.json({ 
        errCode: 112, 
        errMsg: "`id` must be a valid positive number" 
      }, 400);
    }
    
    const post = await PostModel.findById(id);
    if (!post) {
      return c.json({ 
        errCode: 113, 
        errMsg: "Post not found" 
      }, 404);
    }
    
    return c.json({ post }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ 
      errCode: 110, 
      errMsg: "Failed to fetch post" 
    }, 500);
  }
};

// UPDATE: PUT /api/posts/:id
export const updatePost = async (c: Context) => {
  try {
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

    const cleanTitle =
      typeof title === "string" ? title.trim() : "";

    const cleanContent =
      typeof content === "string" ? content.trim() : "";

    if (!cleanTitle) {
      return c.json(
        {
          errCode: 140,
          errMsg: "Title is required for updating",
        },
        400,
      );
    } else if (!cleanContent) {
      return c.json(
        {
          errCode: 141,
          errMsg: "Content is required for updating",
        },
        400,
      );
    }

    const updatedPost = await PostModel.update(
      id,
      cleanTitle,
      cleanContent,
    );

    if (!updatedPost) {
      return c.json(
        {
          errCode: 142,
          errMsg: "Post not found",
        },
        404,
      );
    }

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
// 4. DELETE: DELETE /api/posts/:id
export const deletePost = async (c: Context) => {
  let postId = c.req.param("id");
  if (postId === undefined || postId === null) {
    return c.json({ errCode: 130, errMsg: "`id` is required for this request" }, 400);
  }
  postId = postId.trim();

  const isDeleted: string = await PostModel.delete(postId);
  if (isDeleted === undefined || isDeleted === null) {
    return c.json({ errCode: 131, errMsg: "Failed to delete post" }, 500);
  }

  return c.json({ id: postId });
};
