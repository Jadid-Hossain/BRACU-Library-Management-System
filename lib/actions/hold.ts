"use server";

import { db } from "@/database/drizzle";
import { books, holds, users } from "@/database/schema";
import { eq, and, lt } from "drizzle-orm";
import dayjs from "dayjs";

export async function holdBook({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) {
  const [user] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || user.status !== "APPROVED") {
    return { success: false, error: "Only approved users may hold books." };
  }

  const [book] = await db
    .select({ availableCopies: books.availableCopies })
    .from(books)
    .where(eq(books.id, bookId))
    .limit(1);

  if (!book || book.availableCopies <= 0) {
    return { success: false, error: "No copies left to hold." };
  }

  const [existingHold] = await db
    .select()
    .from(holds)
    .where(
      and(
        eq(holds.userId, userId),
        eq(holds.bookId, bookId),
        eq(holds.status, "ACTIVE"),
      ),
    )
    .limit(1);

  if (existingHold) {
    return { success: false, error: "You already have a hold on this book." };
  }

  const expiresAt = dayjs().add(2, "day").toDate();
  await db.insert(holds).values({
    userId,
    bookId,
    expiresAt,
  });

  await db
    .update(books)
    .set({ availableCopies: book.availableCopies - 1 })
    .where(eq(books.id, bookId));

  return { success: true };
}

export async function autoReleaseHolds() {
  const now = dayjs().toDate();

  const expired = await db
    .select({ id: holds.id, bookId: holds.bookId })
    .from(holds)
    .where(and(eq(holds.status, "ACTIVE"), lt(holds.expiresAt, now)));

  if (expired.length === 0) {
    return { released: 0 };
  }

  let releasedCount = 0;

  for (const h of expired) {
    await db.update(holds).set({ status: "EXPIRED" }).where(eq(holds.id, h.id));

    const [bookRow] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, h.bookId))
      .limit(1);

    await db
      .update(books)
      .set({ availableCopies: bookRow.availableCopies + 1 })
      .where(eq(books.id, h.bookId));

    releasedCount++;
  }

  return { released: releasedCount };
}
