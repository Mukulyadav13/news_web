import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { initSchemaAndSeed } from "./init";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __skribleDb?: any;
  __skriblePool?: Pool;
  __skribleInitPromise?: Promise<void>;
};

function createDbInstance() {
  if (databaseUrl) {
    const pool =
      globalForDb.__skriblePool ??
      new Pool({
        connectionString: databaseUrl,
      });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__skriblePool = pool;
    }
    return drizzleNodePg(pool, { schema });
  } else {
    const client = new PGlite("./.pgdata");
    return drizzlePglite(client, { schema });
  }
}

export const db = globalForDb.__skribleDb ?? createDbInstance();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__skribleDb = db;
}

export async function ensureDbInitialized() {
  if (!globalForDb.__skribleInitPromise) {
    globalForDb.__skribleInitPromise = initSchemaAndSeed(db);
  }
  await globalForDb.__skribleInitPromise;
}

// Kick off initialization asynchronously
ensureDbInitialized().catch((err) => {
  console.error("Failed to initialize database:", err);
});
