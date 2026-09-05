import type { Context } from "hono";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
import { signToken } from "../utils/jwt.js";

// POST /api/anindya/auth/register
export const register = async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => null);
    if (!body) {
      return c.json({ errCode: 210, errMsg: "Invalid JSON body" }, 400);
    }

    const { name, email, password, role } = body;

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanRole =
      typeof role === "string" ? role.trim().toLowerCase() : "user";

    if (!cleanName) {
      return c.json({ errCode: 211, errMsg: "Name is required" }, 400);
    }
    if (cleanName.length < 3) {
      return c.json(
        { errCode: 212, errMsg: "Name must be at least 3 characters" },
        400,
      );
    }
    if (cleanName.length > 100) {
      return c.json(
        { errCode: 213, errMsg: "Name must be at most 100 characters" },
        400,
      );
    }

    if (!cleanEmail) {
      return c.json({ errCode: 214, errMsg: "Email is required" }, 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return c.json({ errCode: 215, errMsg: "Invalid email format" }, 400);
    }

    if (!cleanPassword) {
      return c.json({ errCode: 216, errMsg: "Password is required" }, 400);
    }
    if (cleanPassword.length < 6) {
      return c.json(
        { errCode: 217, errMsg: "Password must be at least 6 characters" },
        400,
      );
    }
    if (cleanPassword.length > 255) {
      return c.json(
        { errCode: 218, errMsg: "Password must be at most 255 characters" },
        400,
      );
    }

    if (cleanRole !== "user" && cleanRole !== "admin") {
      return c.json(
        { errCode: 220, errMsg: "Role must be either 'user' or 'admin'" },
        400,
      );
    }

    const existing = await UserModel.findByEmail(cleanEmail);
    if (existing) {
      return c.json({ errCode: 219, errMsg: "Email already registered" }, 409);
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const newUser = await UserModel.create(
      cleanName,
      cleanEmail,
      hashedPassword,
      cleanRole,
    );

    const token = signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "user" | "admin",
    });

    return c.json(
      {
        message: "User registered successfully",
        user: newUser,
        token,
      },
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    return c.json(
      {
        errCode: 222,
        errMsg: "Failed to register user due to internal server error",
      },
      500,
    );
  }
};

// POST /api/anindya/auth/login
export const login = async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => null);
    if (!body) {
      return c.json({ errCode: 230, errMsg: "Invalid JSON body" }, 400);
    }

    const { email, password } = body;

    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanPassword = typeof password === "string" ? password : "";

    if (!cleanEmail) {
      return c.json({ errCode: 231, errMsg: "Email is required" }, 400);
    }
    if (!cleanPassword) {
      return c.json({ errCode: 232, errMsg: "Password is required" }, 400);
    }

    const user = await UserModel.findByEmail(cleanEmail);

    if (!user) {
      return c.json({ errCode: 233, errMsg: "Invalid credentials" }, 401);
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return c.json({ errCode: 233, errMsg: "Invalid credentials" }, 401);
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "user" | "admin",
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return c.json(
      {
        message: "Login successful",
        user: safeUser,
        token,
      },
      200,
    );
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      { errCode: 234, errMsg: "Failed to login due to internal server error" },
      500,
    );
  }
};

// GET /api/anindya/auth/me - protected (any authenticated user)
export const getMe = async (c: Context) => {
  try {
    const payload = c.get("user");
    if (!payload) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }
    const user = await UserModel.findById(payload.id);
    if (!user) {
      return c.json({ errCode: 235, errMsg: "User not found" }, 404);
    }
    return c.json({ user }, 200);
  } catch (error) {
    console.error("GetMe error:", error);
    return c.json({ errCode: 236, errMsg: "Failed to fetch user" }, 500);
  }
};

// GET /api/anindya/auth/admin - protected + admin only
export const getAdminData = async (c: Context) => {
  try {
    const payload = c.get("user");
    if (!payload) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }
    if (payload.role !== "admin") {
      return c.json(
        { errCode: 240, errMsg: "Forbidden: Admin access required" },
        403,
      );
    }
    const user = await UserModel.findById(payload.id);
    if (!user) {
      return c.json({ errCode: 235, errMsg: "User not found" }, 404);
    }
    return c.json(
      {
        message: "Admin access granted",
        user,
        adminData: "Sensitive admin-only data",
      },
      200,
    );
  } catch (error) {
    console.error("GetAdminData error:", error);
    return c.json({ errCode: 241, errMsg: "Failed to fetch admin data" }, 500);
  }
};

// GET /api/anindya/auth/users - protected + admin only
export const getAllUsers = async (c: Context) => {
  try {
    const payload = c.get("user");
    if (!payload) {
      return c.json({ errCode: 200, errMsg: "Unauthorized" }, 401);
    }
    if (payload.role !== "admin") {
      return c.json(
        { errCode: 240, errMsg: "Forbidden: Admin access required" },
        403,
      );
    }
    const users = await UserModel.findAll();
    return c.json({ users, count: users.length }, 200);
  } catch (error) {
    console.error("GetAllUsers error:", error);
    return c.json({ errCode: 242, errMsg: "Failed to fetch users" }, 500);
  }
};
