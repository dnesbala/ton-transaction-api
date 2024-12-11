import { Request, Response } from "express";
import { getDB } from "../config/db";
import { fetchAndStoreTransactions } from "../services/transaction-service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response-utils";
import { FetchTransactionsQueryParams } from "../schemas/transaction-schema";

export async function fetchTransactions(
  req: Request<{}, {}, {}, FetchTransactionsQueryParams>,
  res: Response
) {
  const { accountAddress, date } = req.query;

  if (!accountAddress) {
    return sendErrorResponse(res, 400, "Missing accountAddress");
  }

  try {
    const { em } = await getDB();

    const transactions = await fetchAndStoreTransactions(
      accountAddress.toString(),
      date
    );

    return sendSuccessResponse(
      res,
      200,
      "Transactions fetched successfully",
      transactions
    );
  } catch (err) {
    return sendErrorResponse(res, 500, "Error fetching transactions", err);
  }
}

export async function getUserBalance(
  req: Request<{ walletAddress: string }>,
  res: Response
) {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return sendErrorResponse(res, 400, "Missing wallet address");
  }

  try {
    const { transactionRepo } = await getDB();
    const userBalance = await transactionRepo.fetchUserBalance(walletAddress);

    return sendSuccessResponse(res, 200, "User balance fetched successfully", {
      total_balance: Number(userBalance),
    });
  } catch (err) {
    return sendErrorResponse(res, 500, "Error getting user balance", err);
  }
}
