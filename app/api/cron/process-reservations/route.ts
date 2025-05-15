import { NextRequest, NextResponse } from "next/server";
import { processExpiredReservations } from "@/lib/actions/book";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Ensure this endpoint is only called by cron job or authorized party
    const authHeader = request.headers.get("authorization");
    if (
      !authHeader ||
      authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Process expired reservations
    const result = await processExpiredReservations();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reservation processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process reservations" },
      { status: 500 }
    );
  }
} 