import { TonTransaction } from "../models/ton-transaction.model";

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
