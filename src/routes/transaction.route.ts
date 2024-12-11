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
  fetchTransactions
);

transactionRoutes.get("/wallet-balance/:walletAddress", getUserBalance);
