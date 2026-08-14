import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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
        ssl:
          databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
            ? false
            : { rejectUnauthorized: false },
      });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__skriblePool = pool;
    }
    return drizzleNodePg(pool, { schema });
  } else {
    // Dynamic require for PGlite so Vercel Serverless Function doesn't bundle WASM when DATABASE_URL is set
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PGlite } = require("@electric-sql/pglite");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle: drizzlePglite } = require("drizzle-orm/pglite");
    const client = new PGlite("./.pgdata");
    return drizzlePglite(client, { schema });
  }
}

export const db = globalForDb.__skribleDb ?? createDbInstance();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__skribleDb = db;
}

export async function ensureDbInitialized() {
  if (databaseUrl) return;

  if (!globalForDb.__skribleInitPromise) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initSchemaAndSeed } = require("./init");
    globalForDb.__skribleInitPromise = initSchemaAndSeed(db);
  }
  await globalForDb.__skribleInitPromise;
}

ensureDbInitialized().catch((err) => {
  console.error("Failed to initialize local database:", err);
});
