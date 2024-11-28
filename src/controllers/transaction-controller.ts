import { Request, Response } from "express";

import { getDB } from "../config/db";
import { Transaction } from "../entities/transaction.entity";
import { TonTransaction } from "../models/ton-transaction.model";
import { getTonTransactions } from "../services/transaction-service";

export async function fetchTransactions(req: Request, res: Response) {
  const { accountAddress, date } = req.query;

  if (!accountAddress) {
    return res.status(400).json({
      "status-code": -1,
      "status-message": "Missing accountAddress",
    });
  }

  // Check on DB if transaction upto that date is available or not
  try {
    const { em } = await getDB();

    const filters: any = { accountAddress };
    if (date) {
      filters.timestamp = {
        $lte: new Date(date as string),
      };
    }

    const dbTransactions = await em.find("Transaction", filters);

    if (dbTransactions.length > 0) {
      return res.status(200).json({
        "status-code": 1,
        "status-message": "Transactions fetched successfully",
        data: dbTransactions,
      });
    }

    // If not, Fetch data from TON Center and udpate DB
    const transactions: TonTransaction[] = await getTonTransactions(
      accountAddress.toString()
    );

    // store on db and return data
    const entities: Transaction[] = transactions.map(
      (t: Partial<TonTransaction>) =>
        em.create(Transaction, {
          accountAddress: String(accountAddress),
          timestamp: new Date(),
          transactionHash: t.hash || "",
          totalFees: BigInt(t.total_fees || 0),
        })
    );

    await em.persistAndFlush(entities);

    return res.status(200).json({
      "status-code": 1,
      "status-message": "Transactions fetched successfully",
      data: entities ?? [],
    });
  } catch (err) {
    console.log("Error fetching transactions:", err);
    return res.status(500).json({
      "status-code": -1,
      "status-message": "Error fetching transactions",
      error: err,
    });
  }
}
