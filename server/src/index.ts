import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import postRoutes from "./routes/postRoutes.js";
import { initDb } from "./config/db.js";

const app = new Hono();

initDb();
app.use(logger());

// Healthcheck
app.get("/", (c) => c.text("Forum API server running..."));

app.route("/api/posts", postRoutes);

const port = Number(process.env.PORT) || 5000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
