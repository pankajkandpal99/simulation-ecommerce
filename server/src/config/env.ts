import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("8800"),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  COOKIE_DOMAIN: z.string(),
  ALLOWED_ORIGINS: z.string(),
  BASE_URL: z.string(),

  // Mailtrap configuration
  MAILTRAP_HOST: z.string(),
  MAILTRAP_PORT: z.string().transform(Number),
  MAILTRAP_USER: z.string(),
  MAILTRAP_PASS: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = (() => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
      PORT: process.env.PORT || "3000",
      JWT_SECRET: process.env.JWT_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
      BASE_URL: process.env.BASE_URL || "http://localhost:8800",

      // Mailtrap credentials
      MAILTRAP_HOST: process.env.MAILTRAP_HOST,
      MAILTRAP_PORT: process.env.MAILTRAP_PORT,
      MAILTRAP_USER: process.env.MAILTRAP_USER,
      MAILTRAP_PASS: process.env.MAILTRAP_PASS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment Variable Validation Failed:");
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join(".")}: ${err.message}`);
      });
      throw new Error(`Invalid environment variables. Check your .env file.`);
    }
    throw error;
  }
})();
