import { Migration } from '@mikro-orm/migrations';

export class Migration20241203081116 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transaction" add column "event_type" varchar(255) not null;`);
    this.addSql(`alter table "transaction" rename column "timestamp" to "transaction_created_at";`);
    this.addSql(`alter table "transaction" rename column "total_fees" to "balance";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transaction" drop column "event_type";`);

    this.addSql(`alter table "transaction" rename column "transaction_created_at" to "timestamp";`);
    this.addSql(`alter table "transaction" rename column "balance" to "total_fees";`);
  }

}
