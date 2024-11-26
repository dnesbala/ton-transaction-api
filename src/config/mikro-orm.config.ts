import dotenv from "dotenv";
import { defineConfig } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

dotenv.config();

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) | 5432,
  debug: true,
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
  },
});
