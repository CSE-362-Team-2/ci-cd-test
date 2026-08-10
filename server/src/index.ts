import { serve } from "@hono/node-server";
import { Hono } from "hono";
import postRoutes from "./routes/postRoutes";
import { initDb } from "./config/db";

const app = new Hono();

initDb();

// Healthcheck
app.get("/", (c) => c.text("Forum API server running..."));

app.route("/api/posts", postRoutes);

const port = Number(process.env.PORT) || 5000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
