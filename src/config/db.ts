import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config";
import { TransactionRepository } from "../repositories/transaction-repository";
import { Transaction } from "../entities/transaction.entity";

export const initDB = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);
    console.log("Database connection succesful");
    return orm;
  } catch (err) {
    console.log("Failed to establish database connection:", err);
    process.exit(1);
  }
};

export interface DB {
  orm: MikroORM;
  em: EntityManager;
  transactionRepo: TransactionRepository;
}

let cache: DB;
export async function getDB(): Promise<DB> {
  if (cache) {
    return cache;
  }

  const orm = await initDB();

  cache = {
    orm,
    em: orm.em,
    transactionRepo: orm.em.getRepository(Transaction),
  };
  return cache;
}
