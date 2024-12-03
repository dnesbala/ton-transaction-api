import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Transaction {
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
