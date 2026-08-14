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

  // READ
  // async findAll(): Promise<Post[]> {
  // },

  // UPDATE
  async update(
    id: number,
    title: string,
    content: string,
  ): Promise<Post | null> {
    const query = `
    UPDATE posts
    SET title = $1, content = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;

    const res = await pool.query(query, [title, content, id]);

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0];
  },

  // DELETE
  // async delete(id: number): Promise<boolean> {
  // },
};
