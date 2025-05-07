// lib/actions/autoFine.ts

import { db } from "@/database/drizzle";
import { borrowRecords, fines } from "@/database/schema";
import { eq, lt } from "drizzle-orm";
import dayjs from "dayjs";

const FINE_RATE_PER_DAY = parseInt(process.env.FINE_RATE_PER_DAY || "1", 10);

export const autoFineOverdues = async () => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    const overdue = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"))
      .where(lt(borrowRecords.dueDate, today));

    for (const rec of overdue) {
      const [existing] = await db
        .select()
        .from(fines)
        .where(eq(fines.borrowRecordId, rec.id))
        .where(eq(fines.status, "PENDING"));
      if (existing) continue;

      const daysLate = dayjs(today).diff(dayjs(rec.dueDate), "day");
      const amount = daysLate * FINE_RATE_PER_DAY;

      await db.insert(fines).values({
        userId: rec.userId,
        borrowRecordId: rec.id,
        amount,
        reason: `Late by ${daysLate} day${daysLate > 1 ? "s" : ""}`,
      });
    }

    console.log(`AutoFine: processed ${overdue.length} records`);
    return { success: true, count: overdue.length };
  } catch (error) {
    console.error("autoFineOverdues error:", error);
    return { success: false, message: (error as Error).message };
  }
};
