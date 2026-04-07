import { Pool } from "pg";
import { env } from "./env";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function testDbConnection() {
  const client = await db.connect();
  try {
    const result = await client.query("SELECT NOW()");
    console.log("Database connected:", result.rows[0]);
  } finally {
    client.release();
  }
}