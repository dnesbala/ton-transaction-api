import { Request, Response } from "express";
import { getDB } from "../config/db";
import { TransactionRepository } from "../repositories/transaction-repository";
import { fetchAndStoreTransactions } from "../services/transaction-service";
import { FetchTransactionsQueryParams } from "../config/types/query-params";

export async function fetchTransactions(
  req: Request<{}, {}, {}, FetchTransactionsQueryParams>,
  res: Response
) {
  const { accountAddress, date } = req.query;

  if (!accountAddress) {
    return res.status(400).json({
      "status-code": -1,
      "status-message": "Missing accountAddress",
    });
  }

  try {
    const { em } = await getDB();
    const transactionRepo = new TransactionRepository(em);

    const transactions = await fetchAndStoreTransactions(
      accountAddress.toString(),
      date,
      transactionRepo
    );

    return res.status(200).json({
      "status-code": 1,
      "status-message": "Transactions fetched successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({
      "status-code": -1,
      "status-message": "Error fetching transactions",
      error: err,
    });
  }
}

export async function getUserBalance(
  req: Request<{ walletAddress: string }>,
  res: Response
) {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res.status(400).json({
      "status-code": -1,
      "status-message": "Missing wallet address",
    });
  }

  try {
    const { em } = await getDB();
    const transactionRepo = new TransactionRepository(em);

    const userBalance = await transactionRepo.fetchUserBalance(walletAddress);

    return res.status(200).json({
      "status-code": 1,
      "status-message": "User balance fetched successfully",
      data: {
        total_balance: Number(userBalance),
      },
    });
  } catch (err) {
    console.error("Error fetching user balance:", err);
    return res.status(500).json({
      "status-code": -1,
      "status-message": "Error getting user balance",
      error: err,
    });
  }
}
