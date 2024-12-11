import { Transaction } from "../entities/transaction.entity";
import { BaseEntity, EntityRepository } from "@mikro-orm/postgresql";

export class TransactionRepository extends EntityRepository<Transaction> {
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

  async fetchUserBalance(walletAddress: string): Promise<BigInt> {
    const userTransactions = await this.em.find(Transaction, {
      accountAddress: walletAddress,
    });

    let totalDeposits = BigInt(0);
    let totalWithdrawals = BigInt(0);
    let totalWinnings = BigInt(0);

    for (const transaction of userTransactions) {
      const balance = transaction.balance ?? BigInt(0);
      switch (transaction.eventType) {
        case "DEPOSIT":
          totalDeposits += balance;
          break;
        case "WITHDRAW":
          totalWithdrawals += balance;
          break;

        case "WINNER_ASSIGNED":
          totalWinnings += balance;
          break;
      }
    }

    const userBalance = totalDeposits + totalWinnings - totalWithdrawals;
    return userBalance;
  }
}
