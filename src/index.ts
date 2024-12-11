import express, { Request, Response } from "express";

import { transactionRoutes } from "./routes/transaction.route";
import { getDB } from "./config/db";
import { RequestContext } from "@mikro-orm/core";

const startApp = async () => {
  const app = express();
  const PORT = process.env.PORT || 8000;

  const db = await getDB();
  app.use((_req, _res, next) => {
    RequestContext.create(db.em, next);
  });

  app.use("/api/transactions", transactionRoutes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      "status-message": "Route not found",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
};

startApp();
