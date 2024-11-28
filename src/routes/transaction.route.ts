import { Request, Router } from "express";
import { fetchTransactions } from "../controllers/transaction-controller";

export const transactionRoutes = Router();

transactionRoutes.get("/", async (req, res, next) => {
  try {
    await fetchTransactions(req, res);
  } catch (error) {
    next(error);
  }
});
