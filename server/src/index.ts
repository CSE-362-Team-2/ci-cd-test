import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Pool } from "pg";

const app = new Hono();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "myappdb_dev",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "devpassword123",
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/db-test", async (c) => {
  try {
    const res = await pool.query("SELECT NOW() AS current_time, version()");
    return c.json({
      status: "success",
      message: "Successfully connected to PostgreSQL!",
      databaseTime: res.rows[0].current_time,
      postgresVersion: res.rows[0].version,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to connect to the database",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

const port = Number(process.env.PORT) || 5000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
