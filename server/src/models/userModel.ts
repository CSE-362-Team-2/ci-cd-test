import { pool } from "../config/db.js";
import type { SafeUser, User } from "../types/userType.js";

export const UserModel = {
  async create(
    name: string,
    email: string,
    hashedPassword: string,
    role: string = "user",
  ): Promise<SafeUser> {
    const query = `
      INSERT INTO anindya_users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const res = await pool.query(query, [name, email, hashedPassword, role]);
    return res.rows[0];
  },

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM anindya_users WHERE email = $1`;
    const res = await pool.query(query, [email]);
    return res.rows[0] || null;
  },

  async findById(id: number): Promise<SafeUser | null> {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM anindya_users WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  },

  async findAll(): Promise<SafeUser[]> {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM anindya_users ORDER BY created_at DESC`;
    const res = await pool.query(query);
    return res.rows;
  },
};
