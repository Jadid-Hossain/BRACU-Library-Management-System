import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import AdminBorrowRecordList from "@/components/admin/AdminBorrowRecordList";

export default async function Page() {
  const allRecords = await db
    .select({
      id: borrowRecords.id,
      userName: users.fullName,
      bookTitle: books.title,
      status: borrowRecords.status,
      dueDate: borrowRecords.dueDate,
      borrowDate: borrowRecords.borrowDate,
      returnDate: borrowRecords.returnDate,
    })
    .from(borrowRecords)
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .leftJoin(books, eq(borrowRecords.bookId, books.id));

  return <AdminBorrowRecordList initialRecords={allRecords} />;
}
