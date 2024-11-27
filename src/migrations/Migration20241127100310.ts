import { Migration } from '@mikro-orm/migrations';

export class Migration20241127100310 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "transaction" ("id" serial primary key, "account_address" varchar(255) not null, "timestamp" timestamptz not null, "transaction_hash" varchar(255) not null, "wallet_address" varchar(255) null, "total_fees" bigint null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "transaction" cascade;`);
  }

}
