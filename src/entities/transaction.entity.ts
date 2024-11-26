import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class Transaction {
  @PrimaryKey()
  id!: number;
}
