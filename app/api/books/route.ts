import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";

export async function GET() {
  const allBooks = await db.select().from(books);
  return NextResponse.json(allBooks);
}
