"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const [user] = await db
      .select({ status: users.status, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.status !== "APPROVED") {
      return {
        success: false,
        error: "Only approved users can borrow books",
      };
    }

    const [book] = await db
      .select({
        availableCopies: books.availableCopies,
        createdAt: books.createdAt,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book || book.availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }
    // check 48 hours
    const createdAt = dayjs(book.createdAt);
    const now = dayjs();
    const cutoff = createdAt.add(2, "day");
    const inPriorityWindow = now.isBefore(cutoff);

    if (inPriorityWindow && user.role !== "FACULTY") {
      const hoursLeft = Math.ceil(cutoff.diff(now, "hour", true));
      return {
        success: false,
        error: `Only faculty may borrow this book in the first 48 hours. Available in ~${hoursLeft} hour(s).`,
      };
    }

    const [existingBorrow] = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED"),
        ),
      )
      .limit(1);

    if (existingBorrow) {
      return {
        success: false,
        error: "You’ve already borrowed this book",
      };
    }

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book.availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const returnBook = async (params: ReturnBookParams) => {
  const { recordId, bookId } = params;

  try {
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: dayjs().format("YYYY-MM-DD"),
      })
      .where(eq(borrowRecords.id, recordId));

    const [bookRow] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    await db
      .update(books)
      .set({ availableCopies: bookRow.availableCopies + 1 })
      .where(eq(books.id, bookId));

    return { success: true };
  } catch (error: any) {
    console.error("returnBook error:", error);
    return { success: false, error: "Failed to return book" };
  }
};
