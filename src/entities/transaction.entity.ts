import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { TransactionRepository } from "../repositories/transaction-repository";

@Entity({ repository: () => TransactionRepository })
export class Transaction {
  [EntityRepositoryType]?: TransactionRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  accountAddress!: string;

  @Property()
  eventType!: string;

  @Property()
  transactionCreatedAt!: Date;

  @Property()
  transactionHash!: string;

  @Property({ columnType: "bigint" })
  balance?: bigint;
}
