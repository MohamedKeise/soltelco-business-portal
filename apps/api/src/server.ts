import app from "./app";
import { env } from "./config/env";
import { testDbConnection } from "./config/db";

app.listen(env.PORT, async () => {
  console.log(`API running on http://localhost:${env.PORT}`);

  try {
    await testDbConnection();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});