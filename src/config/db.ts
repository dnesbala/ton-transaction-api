import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config";

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
