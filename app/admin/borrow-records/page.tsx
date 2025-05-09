import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, users, books, fines } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import AdminBorrowRecordList from "@/components/admin/AdminBorrowRecordList";

export default async function Page() {
  const allRecords = await db
    .select({
      id: borrowRecords.id,
      userName: users.fullName,
      bookTitle: books.title,
      status: borrowRecords.status,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      pendingFine: fines.status,
    })
    .from(borrowRecords)
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(
      fines,
      and(
        eq(fines.borrowRecordId, borrowRecords.id),
        eq(fines.status, "PENDING"),
      ),
    );

  const initialRecords = allRecords.map((r) => ({
    ...r,
    pendingFine: r.pendingFine === "PENDING",
  }));

  return <AdminBorrowRecordList initialRecords={initialRecords} />;
}
