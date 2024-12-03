import { Request, Router } from "express";
import { fetchTransactions } from "../controllers/transaction-controller";
import { FetchTransactionsQueryParams } from "../config/types/query-params";

export const transactionRoutes = Router();

transactionRoutes.get(
  "/",
  async (req: Request<{}, {}, {}, FetchTransactionsQueryParams>, res, next) => {
    try {
      await fetchTransactions(req, res);
    } catch (error) {
      next(error);
    }
  }
);
