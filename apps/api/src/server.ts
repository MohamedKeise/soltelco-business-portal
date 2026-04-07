import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { testDbConnection } from "./config/db";

const app = express();

// Security headers
app.use(helmet());

// CORS (allow your Vite web app)
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// JSON body
app.use(express.json({ limit: "1mb" }));

// Basic rate limit (anti abuse)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

// keep your route but under /api/auth (recommended)
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.listen(env.PORT, async () => {
  console.log(`API running on http://localhost:${env.PORT}`);

  try {
    await testDbConnection();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});