import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { fines, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const [fineRecord] = await db
      .select({
        userId: fines.userId,
        borrowStatus: borrowRecords.status,
      })
      .from(fines)
      .innerJoin(borrowRecords, eq(fines.borrowRecordId, borrowRecords.id))
      .where(eq(fines.id, id))
      .limit(1);

    if (!fineRecord) {
      return NextResponse.json(
        { success: false, message: "Fine not found" },
        { status: 404 },
      );
    }

    if (fineRecord.borrowStatus !== "RETURNED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please return the book before paying this fine.",
        },
        { status: 400 },
      );
    }

    await db
      .update(fines)
      .set({ status: "PAID", paidAt: new Date() })
      .where(eq(fines.id, id));

    const unpaidFines = await db
      .select()
      .from(fines)
      .where(
        and(eq(fines.userId, fineRecord.userId), eq(fines.status, "PENDING")),
      );

    if (unpaidFines.length === 0) {
      await db
        .update(users)
        .set({ status: "APPROVED" })
        .where(eq(users.id, fineRecord.userId));
      console.log(`User ${fineRecord.userId} status set to APPROVED`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pay fine error:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
