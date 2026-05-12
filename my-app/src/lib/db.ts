import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  biodbPool?: Pool;
};

let poolInstance: Pool | undefined;

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

  poolInstance =
    globalForDb.biodbPool ??
    new Pool({
      connectionString,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbPool = poolInstance;
  }

  return poolInstance;
}

export const pool = new Proxy({} as Pool, {
  get(_target, property, receiver) {
    const instance = getPool();
    const value = Reflect.get(instance, property, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
}) as Pool;
