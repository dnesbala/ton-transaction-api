import { Migration } from '@mikro-orm/migrations';

export class Migration20241128121214 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transaction" drop column "wallet_address";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transaction" add column "wallet_address" varchar(255) null;`);
  }

}
