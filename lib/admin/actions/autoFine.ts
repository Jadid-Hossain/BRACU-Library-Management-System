import { db } from "@/database/drizzle";
import { borrowRecords, fines, users } from "@/database/schema";
import { eq, lt, and } from "drizzle-orm";
import dayjs from "dayjs";

const FINE_RATE_PER_DAY = 100;

export const autoFineOverdues = async () => {
  console.log("autoFineOverdues() called");

  try {
    const today = dayjs().format("YYYY-MM-DD");

    const overdue = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.status, "BORROWED"),
          lt(borrowRecords.dueDate, today),
        ),
      );

    console.log(`Found ${overdue.length} overdue record(s)`);

    for (const rec of overdue) {
      const daysLate = dayjs(today).diff(dayjs(rec.dueDate), "day");
      const newAmount = daysLate * FINE_RATE_PER_DAY;

      const [existing] = await db
        .select()
        .from(fines)
        .where(
          and(eq(fines.borrowRecordId, rec.id), eq(fines.status, "PENDING")),
        );

      if (existing) {
        console.log(
          `Record ${rec.id} already has fine $${existing.amount}. ` +
            `Recomputed would be taka ${newAmount}.`,
        );

        if (newAmount > existing.amount) {
          await db
            .update(fines)
            .set({
              amount: newAmount,
              reason: `Late by ${daysLate} day${daysLate > 1 ? "s" : ""}`,
              issuedAt: new Date(),
            })
            .where(eq(fines.id, existing.id));

          console.log(
            `Updated fine ${existing.id} to new amount taka ${newAmount}`,
          );
        } else {
          console.log(`No update needed for fine ${existing.id}`);
        }

        continue;
      }

      console.log(
        `Inserting new fine for record ${rec.id}: ` +
          `${daysLate} day(s) late → taka ${newAmount}`,
      );

      await db.insert(fines).values({
        userId: rec.userId,
        borrowRecordId: rec.id,
        amount: newAmount,
        reason: `Late by ${daysLate} day${daysLate > 1 ? "s" : ""}`,
      });

      await db
        .update(users)
        .set({ status: "REJECTED" })
        .where(eq(users.id, rec.userId));

      console.log(`User ${rec.userId} status set to REJECTED due to fine.`);
    }

    console.log(`autoFineOverdues done—processed ${overdue.length} records`);
    return { success: true, count: overdue.length };
  } catch (error) {
    console.error("autoFineOverdues error:", error);
    return { success: false, message: (error as Error).message };
  }
};
