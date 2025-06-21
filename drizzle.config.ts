import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
