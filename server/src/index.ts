import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import postRoutes from "./routes/postRoutes.js";
import { initDb } from "./config/db.js";
import { prometheus } from "@hono/prometheus";

const app = new Hono();
const { printMetrics, registerMetrics } = prometheus();

initDb();
app.use(logger());

// setup prometheus monitoring endpoint /metrics
app.use(registerMetrics);
app.get('/metrics', printMetrics);

app.route("/api/posts", postRoutes);

const port = Number(process.env.PORT) || 5000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
