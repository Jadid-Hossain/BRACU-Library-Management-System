import { db } from "@/database/drizzle";
import { fines, borrowRecords, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { borrowRecordId, amount, reason } = await req.json();

    const record = await db
      .select({ userId: borrowRecords.userId })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, borrowRecordId))
      .limit(1);

    if (!record.length) {
      return NextResponse.json(
        { error: "Borrow record not found" },
        { status: 404 },
      );
    }

    const userId = record[0].userId;

    await db.insert(fines).values({
      borrowRecordId,
      userId,
      amount,
      reason,
      status: "PENDING",
      issuedBy: "ADMIN",
    });

    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Fine added and user rejected" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
