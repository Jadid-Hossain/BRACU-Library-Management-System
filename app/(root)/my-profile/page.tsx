import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import {
  users,
  books as booksTable,
  borrowRecords,
  fines as finesTable,
  reservations,
} from "@/database/schema";
import { eq, and, not } from "drizzle-orm";
import BookCard from "@/components/BookCard";
import FineList, { FineItem } from "@/components/FineList";
import UserReservations from "@/components/UserReservations";
import dayjs from "dayjs";

export default async function MyProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const userId = session.user.id;

  const [userRow] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, userId));
  const userStatus = userRow?.status;

  const unpaidFineCount = await db
    .select()
    .from(finesTable)
    .where(
      and(eq(finesTable.userId, userId), eq(finesTable.status, "PENDING")),
    );
  const hasUnpaidFines = unpaidFineCount.length > 0;

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

  const fineRows = await db
    .select({
      id: finesTable.id,
      bookId: booksTable.id,
      amount: finesTable.amount,
      reason: finesTable.reason,
      status: finesTable.status,
      issuedAt: finesTable.issuedAt,
      paidAt: finesTable.paidAt,
      borrowStatus: borrowRecords.status,
      bookTitle: booksTable.title,
    })
    .from(finesTable)
    .innerJoin(borrowRecords, eq(finesTable.borrowRecordId, borrowRecords.id))
    .innerJoin(booksTable, eq(borrowRecords.bookId, booksTable.id))
    .where(eq(finesTable.userId, userId));

  const finesList: FineItem[] = fineRows.map((f) => ({
    id: f.id,
    bookId: f.bookId,
    bookTitle: f.bookTitle,
    amount: f.amount,
    reason: f.reason,
    status: f.status,
    issuedAt: f.issuedAt.toISOString(),
    paidAt: f.paidAt ? f.paidAt.toISOString() : null,
    borrowStatus: f.borrowStatus,
  }));

  // Get user's active reservations
  const userReservations = await db
    .select({
      id: reservations.id,
      bookId: booksTable.id,
      bookTitle: booksTable.title,
      reservationDate: reservations.reservationDate,
      expiryDate: reservations.expiryDate,
      status: reservations.status,
      position: reservations.position,
    })
    .from(reservations)
    .innerJoin(booksTable, eq(reservations.bookId, booksTable.id))
    .where(
      and(
        eq(reservations.userId, userId),
        not(eq(reservations.status, "CANCELLED")),
        not(eq(reservations.status, "BORROWED"))
      )
    );

  const reservationsList = userReservations.map(r => ({
    ...r,
    reservationDate: r.reservationDate.toISOString(),
    expiryDate: r.expiryDate ? r.expiryDate.toISOString() : null,
  }));

  return (
    <div className="p-6 space-y-8">
      {userStatus === "REJECTED" && hasUnpaidFines && (
        <div className="max-w-4xl mx-auto p-4 bg-red-800 text-white font-semibold rounded">
          You cannot borrow any books until you pay the fine.
        </div>
      )}

      {/* Borrowed Books Section */}
      <section className="max-w-4xl mx-auto">
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
      </section>

      {/* Reservations Section */}
      <section className="max-w-5xl mx-auto">
        <UserReservations reservations={reservationsList} />
      </section>

      {/* Fines Section */}
      <section className="max-w-5xl mx-auto">
        <FineList initialFines={finesList} />
      </section>
    </div>
  );
}
