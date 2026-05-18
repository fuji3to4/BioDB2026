import { drizzle } from "drizzle-orm/node-postgres";

type Database = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  biodbDb?: Database;
};

let dbInstance: Database | undefined;

function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (globalForDb.biodbDb) {
    dbInstance = globalForDb.biodbDb;
    return dbInstance;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  dbInstance = drizzle(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbDb = dbInstance;
  }

  return dbInstance;
}

export const db: Pick<Database, "execute"> = {
  execute(...args: Parameters<Database["execute"]>) {
    const instance = getDb();
    return instance.execute(...args);
  },
};
