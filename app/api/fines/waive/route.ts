import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { fines, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { borrowRecordId } = await request.json();
    if (!borrowRecordId) {
      return NextResponse.json(
        { error: "borrowRecordId is required" },
        { status: 400 },
      );
    }

    const [pendingFine] = await db
      .select({ userId: fines.userId })
      .from(fines)
      .where(
        and(
          eq(fines.borrowRecordId, borrowRecordId),
          eq(fines.status, "PENDING"),
        ),
      )
      .limit(1);

    if (!pendingFine) {
      return NextResponse.json(
        { error: "No pending fine found for this record" },
        { status: 404 },
      );
    }

    const result = await db
      .update(fines)
      .set({ status: "WAIVED" })
      .where(
        and(
          eq(fines.borrowRecordId, borrowRecordId),
          eq(fines.status, "PENDING"),
        ),
      );

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Failed to waive fine" },
        { status: 500 },
      );
    }

    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, pendingFine.userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error waiving fine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
