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
  // async update(
  //   id: number,
  //   title: string,
  //   content: string,
  // ): Promise<Post | null> {
  // },

  // DELETE
  async delete(id: string): Promise<string> {
    const query = `
      DELETE FROM posts WHERE id = $1
      RETURNING id
    `;

    const res = await pool.query(query, [id]);
    return res.rows[0];
  },
};
