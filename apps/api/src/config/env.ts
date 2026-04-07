import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default("development"),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string().min(1),
  MAIL_FROM_NAME: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);