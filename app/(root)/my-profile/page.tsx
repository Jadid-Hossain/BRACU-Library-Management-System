import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { borrowRecords, books as booksTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import BookCard from "@/components/BookCard";
import dayjs from "dayjs";

export default async function MyProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const userId = session.user.id;

  const records = await db
    .select({
      book: {
        id: booksTable.id,
        title: booksTable.title,
        author: booksTable.author,
        genre: booksTable.genre,
        rating: booksTable.rating,
        totalCopies: booksTable.totalCopies,
        availableCopies: booksTable.availableCopies,
        description: booksTable.description,
        coverUrl: booksTable.coverUrl,
        coverColor: booksTable.coverColor,
        videoUrl: booksTable.videoUrl,
        summary: booksTable.summary,
        createdAt: booksTable.createdAt,
      },
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .innerJoin(booksTable, eq(borrowRecords.bookId, booksTable.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    );

  const booksForList = records.map((r) => {
    const due = dayjs(r.dueDate);
    const today = dayjs().startOf("day");
    const daysLeft = due.diff(today, "day");

    return {
      ...r.book,
      video: r.book.videoUrl,
      isLoanedBook: true,
      daysLeft,
    };
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-200">
        My Borrowed Books
      </h1>

      {booksForList.length > 0 ? (
        <ul className="book-list">
          {booksForList.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">You have no books currently borrowed.</p>
      )}
    </div>
  );
}
