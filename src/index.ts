import express from "express";
import { initDB } from "./config/db";

const startApp = async () => {
  const app = express();
  const PORT = process.env.PORT || 8000;

  const orm = await initDB();

  app.locals.orm = orm;

  app.get("/", (req, res) => {
    res.json({ test: "test response" });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
};

startApp();
