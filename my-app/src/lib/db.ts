import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import type { SQL } from "drizzle-orm";

// ローカル PostgreSQL と Neon の両方に対応する最小限のクライアント型。
// アプリコードは execute のみを使うので、ここだけを公開する。
type DbClient = {
  execute: (query: SQL) => Promise<{ rows: unknown[] }>;
};

const globalForDb = globalThis as typeof globalThis & {
  biodbDb?: DbClient;
};

let dbInstance: DbClient | undefined;

function isNeonConnectionString(connectionString: string): boolean {
  return connectionString.includes(".neon.tech");
}

function createDbClient(connectionString: string): DbClient {
  if (isNeonConnectionString(connectionString)) {
    const db = drizzleNeon(connectionString);
    return {
      execute: async (query) => {
        const result = await db.execute(query);
        // Neon の neon() は行の配列を直接返す。node-postgres は { rows } を返す。
        // どちらのドライバでも result.rows でアクセスできるように正規化する。
        return Array.isArray(result) ? { rows: result } : (result as { rows: unknown[] });
      },
    };
  }

  const db = drizzleNodePostgres(connectionString);
  return {
    execute: (query) => db.execute(query),
  };
}

function getDb(): DbClient {
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

  dbInstance = createDbClient(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbDb = dbInstance;
  }

  return dbInstance;
}

export const db: DbClient = {
  execute(...args: Parameters<DbClient["execute"]>) {
    const instance = getDb();
    return instance.execute(...args);
  },
};
