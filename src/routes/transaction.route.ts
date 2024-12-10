import { Request, Response, NextFunction, Router } from "express";
import {
  fetchTransactions,
  getUserBalance,
} from "../controllers/transaction-controller";
import {
  FetchTransactionsQueryParams,
  fetchTransactionsQueryParamsSchema,
} from "../schemas/transaction-schema";
import { validateSchema } from "../utils/validate-request";

export const transactionRoutes = Router();

transactionRoutes.get(
  "/",
  validateSchema(fetchTransactionsQueryParamsSchema, "query"),
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
