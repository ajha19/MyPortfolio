import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.ts";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const parsed = new URL(url);
  console.log(
    `[DB_RUNTIME] host=${parsed.hostname} database=${parsed.pathname.slice(1)}`
  );

  return postgres(url);
}

const client = globalThis.__dbClient ?? createClient();
if (process.env.NODE_ENV !== "production") globalThis.__dbClient = client;

export const db = drizzle(client, { schema });
