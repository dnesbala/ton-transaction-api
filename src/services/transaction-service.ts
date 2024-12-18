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
import { decodeBase64ToCell } from "./ton-utils";
import { getDB } from "../config/db";

export async function fetchAndStoreTransactions(
  accountAddress: string,
  date: string | undefined
): Promise<Transaction[]> {
  const filters: any = { accountAddress };
  if (date) {
    filters.transactionCreatedAt = {
      $lte: new Date(date),
    };
  }

  // Check transactions in DB
  const { transactionRepo } = await getDB();
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
        const value: string = getBalanceFromMessageContentBody(
          eventMessage.message.message_content.body
        );

        return {
          accountAddress,
          transactionCreatedAt: new Date(
            Number(eventMessage.message.created_at) * 1000
          ),
          eventType: eventMessage.eventType,
          transactionHash: eventMessage.message.hash,
          balance: BigInt(value),
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

function getBalanceFromMessageContentBody(messageBody: string): string {
  const decodedMessageContentBody = decodeBase64ToCell(
    messageBody
    // @ts-expect-error this should work
  ).beginParse();

  decodedMessageContentBody.loadUint(32);
  return decodedMessageContentBody.loadCoins().toString(10);
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
