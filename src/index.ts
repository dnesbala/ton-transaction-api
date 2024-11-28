import express, { Request, Response } from "express";

import { transactionRoutes } from "./routes/transaction.route";

const startApp = async () => {
  const app = express();
  const PORT = process.env.PORT || 8000;

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
