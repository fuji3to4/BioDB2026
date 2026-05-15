import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type Database = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  biodbPool?: Pool;
  biodbDb?: Database;
};

let poolInstance: Pool | undefined;
let dbInstance: Database | undefined;

function getPool(): Pool {
  if (poolInstance) {
    return poolInstance;
  }

  if (globalForDb.biodbPool) {
    poolInstance = globalForDb.biodbPool;
    return poolInstance;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  poolInstance = new Pool({
    connectionString,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbPool = poolInstance;
  }

  return poolInstance;
}

function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (globalForDb.biodbDb) {
    dbInstance = globalForDb.biodbDb;
    return dbInstance;
  }

  const pool = getPool();
  dbInstance = drizzle(pool);

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbDb = dbInstance;
  }

  return dbInstance;
}

function getDbProperty(property: PropertyKey) {
  const instance = getDb();
  const value = Reflect.get(instance, property, instance);
  return typeof value === "function" ? value.bind(instance) : value;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    if (!dbInstance && !globalForDb.biodbDb && !process.env.DATABASE_URL) {
      // Staged migration: some modules import db before DATABASE_URL is set.
      // Defer the error until the first call instead of failing at import time.
      return (...args: unknown[]) => {
        const value = getDbProperty(property);
        if (typeof value === "function") {
          return value(...args);
        }
        if (args.length > 0) {
          throw new Error(`Property ${String(property)} is not callable`);
        }
        return value;
      };
    }

    return getDbProperty(property);
  },
}) as Database;

// Temporary compatibility export while remaining migration tasks update imports.
export const pool = new Proxy({} as Pool, {
  get(_target, property, receiver) {
    const instance = getPool();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
}) as Pool;
