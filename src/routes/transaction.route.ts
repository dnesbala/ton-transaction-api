import { Request, Response, NextFunction, Router } from "express";
import {
  fetchTransactions,
  getUserBalance,
} from "../controllers/transaction-controller";
import { FetchTransactionsQueryParams } from "../config/types/query-params";

export const transactionRoutes = Router();

transactionRoutes.get(
  "/",
  async (
    req: Request<{}, {}, {}, FetchTransactionsQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await fetchTransactions(req, res);
    } catch (error) {
      next(error);
    }
  }
);

transactionRoutes.get(
  "/wallet-balance/:walletAddress",
  async (
    req: Request<{ walletAddress: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await getUserBalance(req, res);
    } catch (error) {
      next(error);
    }
  }
);
