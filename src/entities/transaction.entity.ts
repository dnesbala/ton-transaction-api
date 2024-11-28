import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Property()
  accountAddress!: string;

  @Property()
  timestamp!: Date;

  @Property()
  transactionHash!: string;

  @Property({ columnType: "bigint" })
  totalFees?: bigint;
}
