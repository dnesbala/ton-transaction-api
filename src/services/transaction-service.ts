import { TransactionRepository } from "../repositories/transaction-repository";
import { Transaction } from "../entities/transaction.entity";
import { TonTransaction } from "../models/ton-transaction.model";
import {
  EventMessage,
  EventType,
} from "../config/types/transactions/transaction-types";
import {
  TON_POOL_DEPOSIT_EVENT_HASH,
  TON_POOL_WINNER_ASSIGNED_EVENT_HASH,
  TON_POOL_WINNER_NUMBER_DECIDED_EVENT_HASH,
  TON_POOL_WITHDRAW_EVENT_HASH,
} from "../config/constants/ton-constants";

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

  let transactionsForEvents: Partial<Transaction>[] = [];
  // Map and store them in the database
  for (const tonTransaction of tonTransactions) {
    const eventMessages = determineTonPoolEventMessages(tonTransaction);

    if (!eventMessages.length) {
      continue;
    }

    transactionsForEvents.push(
      ...eventMessages.map((eventMessage) => {
        return {
          accountAddress,
          transactionCreatedAt: new Date(
            Number(eventMessage.message.created_at) * 1000
          ),
          eventType: eventMessage.eventType,
          transactionHash: eventMessage.message.hash,
          balance: BigInt(eventMessage.message.value || 0),
        };
      })
    );
  }

  await transactionRepo.createTransactions(transactionsForEvents);
  return await transactionRepo.findTransactions(filters);
}

function determineTonPoolEventMessages(
  transaction: TonTransaction
): EventMessage[] {
  const hashToEventType: { [key: string]: EventType } = {
    [TON_POOL_DEPOSIT_EVENT_HASH]: EventType.DEPOSIT,
    [TON_POOL_WITHDRAW_EVENT_HASH]: EventType.WITHDRAW,
    [TON_POOL_WINNER_ASSIGNED_EVENT_HASH]: EventType.WINNER_ASSIGNED,
    [TON_POOL_WINNER_NUMBER_DECIDED_EVENT_HASH]:
      EventType.WINNER_NUMBER_DECIDED,
  };

  const eventTypes: EventMessage[] = [];
  for (const message of transaction.out_msgs) {
    const eventType = hashToEventType[message.opcode ?? ""];
    if (eventType) {
      eventTypes.push({ eventType, message });
    }
  }

  return eventTypes;
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
