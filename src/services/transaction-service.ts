import { TransactionRepository } from "../repositories/transaction-repository";
import { Transaction } from "../entities/transaction.entity";
import { TonTransaction } from "../models/ton-transaction.model";

export async function fetchAndStoreTransactions(
  accountAddress: string,
  date: string | undefined,
  transactionRepo: TransactionRepository
): Promise<Transaction[]> {
  const filters: any = { accountAddress };
  if (date) {
    filters.timestamp = {
      $lte: new Date(date),
    };
  }

  // Check transactions in DB
  const dbTransactions = await transactionRepo.findTransactions(filters);
  if (dbTransactions.length > 0) {
    return dbTransactions;
  }

  // Fetch transactions from TON
  const tonTransactions: TonTransaction[] = await getTonTransactions(
    accountAddress
  );

  // Map and store them in the database
  // TODO: fix eventType and balance fields
  const newTransactions: Partial<Transaction>[] = tonTransactions.map((t) => ({
    accountAddress,
    transactionCreatedAt: new Date(),
    eventType: "",
    transactionHash: t.hash || "",
    balance: BigInt(t.total_fees || 0),
  }));

  await transactionRepo.createTransactions(newTransactions);

  return await transactionRepo.findTransactions(filters);
}

export async function getTonTransactions(
  accountAddress: string
): Promise<TonTransaction[]> {
  const response = await fetch(
    `https://testnet.toncenter.com/api/v3/transactions?account=${accountAddress}&limit=128&offset=0&sort=desc`
  );

  if (!response.ok) {
    throw new Error("TonCenter Transaction API Failure");
  }

  const data = await response.json();
  const transactions: TonTransaction[] = data.transactions;
  return transactions;
}
