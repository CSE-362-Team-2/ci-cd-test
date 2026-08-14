import { pool } from "../config/db.js";
import type { Post } from "../types/postsType.js";

export const PostModel = {
  // CREATE
  async create(title: string, content: string, author: string): Promise<Post> {
    const query = `
      INSERT INTO posts (title, content, author)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const res = await pool.query(query, [title, content, author]);
    return res.rows[0];
  },

  async findAll(): Promise<Post[]> {
    const query = `
      SELECT * FROM posts
      ORDER BY created_at DESC
    `;

    const res = await pool.query(query);
    return res.rows;
  },

  // READ - Get single post by ID
  async findById(id: number): Promise<Post | null> {
    const query = `
      SELECT * FROM posts
      WHERE id = $1
    `;

    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  },

  // UPDATE
  // async update(
  //   id: number,
  //   title: string,
  //   content: string,
  // ): Promise<Post | null> {
  // },

  // DELETE
  // async delete(id: number): Promise<boolean> {
  // },
};
