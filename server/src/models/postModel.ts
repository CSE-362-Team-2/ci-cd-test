import { pool } from "../config/db.js";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  user_id?: number;
  created_at: Date;
  updated_at: Date;
}

export const PostModel = {
  async findAll(): Promise<Post[]> {
    const query = `SELECT * FROM posts ORDER BY created_at DESC`;
    const res = await pool.query(query);
    return res.rows;
  },

  async findById(id: number): Promise<Post | null> {
    const query = `SELECT * FROM posts WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  },

  async create(title: string, content: string, author: string, userId?: number): Promise<Post> {
    const query = `
      INSERT INTO posts (title, content, author, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await pool.query(query, [title, content, author, userId]);
    return res.rows[0];
  },

  async update(id: number, title: string, content: string): Promise<Post | null> {
    const query = `
      UPDATE posts 
      SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const res = await pool.query(query, [title, content, id]);
    return res.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM posts WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  },

  async findByUserId(userId: number): Promise<Post[]> {
    const query = `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`;
    const res = await pool.query(query, [userId]);
    return res.rows;
  },
};
