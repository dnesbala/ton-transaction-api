import { EntityManager } from "@mikro-orm/core";
import { Transaction } from "../entities/transaction.entity";

export class TransactionRepository {
  private em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async findTransactions(filters: any): Promise<Transaction[]> {
    return await this.em.find(Transaction, filters);
  }

  async createTransactions(
    transactions: Partial<Transaction>[]
  ): Promise<void> {
    const entities = transactions.map((data) =>
      this.em.create(Transaction, {
        accountAddress: data.accountAddress ?? "",
        eventType: data.eventType || "",
        transactionCreatedAt: data.transactionCreatedAt || new Date(),
        transactionHash: data.transactionHash || "",
        balance: BigInt(data.balance || 0),
      })
    );
    await this.em.persistAndFlush(entities);
  }
}
