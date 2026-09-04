import { pool } from "../config/db.js";
import type { SafeUser, User } from "../types/userType.js";

export const UserModel = {
  async create(
    username: string,
    email: string,
    hashedPassword: string,
  ): Promise<SafeUser> {
    const query = `
      INSERT INTO anindya_users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at
    `;
    const res = await pool.query(query, [username, email, hashedPassword]);
    return res.rows[0];
  },

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM anindya_users WHERE email = $1`;
    const res = await pool.query(query, [email]);
    return res.rows[0] || null;
  },

  async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM anindya_users WHERE username = $1`;
    const res = await pool.query(query, [username]);
    return res.rows[0] || null;
  },

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    const query = `SELECT * FROM anindya_users WHERE email = $1 OR username = $2`;
    const res = await pool.query(query, [email, username]);
    return res.rows[0] || null;
  },

  async findById(id: number): Promise<SafeUser | null> {
    const query = `SELECT id, username, email, created_at, updated_at FROM anindya_users WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  },

  async findByLoginIdentifier(identifier: string): Promise<User | null> {
    // allow login with either email or username (case-sensitive)
    const query = `SELECT * FROM anindya_users WHERE email = $1 OR username = $1`;
    const res = await pool.query(query, [identifier]);
    return res.rows[0] || null;
  },
};
