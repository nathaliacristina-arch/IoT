import { drizzle } from "drizzle-orm/mysql2";
import { iotDevices } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function test() {
  const result = await db.select().from(iotDevices).limit(3);
  console.log("Devices:", result);
  console.log("IDs:", result.map(d => d.id));
}

test().catch(console.error);
