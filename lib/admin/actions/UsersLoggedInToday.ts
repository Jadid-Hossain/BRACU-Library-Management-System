// lib/admin/queries/getUsersLoggedInToday.ts
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getUsersLoggedInToday() {
  const today = new Date().toISOString().split("T")[0];
  return await db.select().from(users).where(eq(users.lastActivityDate, today));
}
