import React from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  users,
  fines as finesTable,
  borrowRecords,
  books as booksTable,
} from "@/database/schema";
import AdminUserEdit from "@/components/admin/AdminUserEdit";
import AdminFineList, { AdminFineItem } from "@/components/admin/AdminFineList";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) {
    notFound();
  }

  const fineRows = await db
    .select({
      id: finesTable.id,
      bookTitle: booksTable.title,
      amount: finesTable.amount,
      reason: finesTable.reason,
      status: finesTable.status,
      issuedAt: finesTable.issuedAt,
      paidAt: finesTable.paidAt,
    })
    .from(finesTable)
    .innerJoin(borrowRecords, eq(finesTable.borrowRecordId, borrowRecords.id))
    .innerJoin(booksTable, eq(borrowRecords.bookId, booksTable.id))
    .where(eq(finesTable.userId, id));

  const adminFines: AdminFineItem[] = fineRows.map((f) => ({
    id: f.id,
    bookTitle: f.bookTitle,
    amount: f.amount,
    reason: f.reason,
    status: f.status,
    issuedAt: f.issuedAt.toISOString(),
    paidAt: f.paidAt ? f.paidAt.toISOString() : null,
  }));

  return (
    <div className="space-y-8">
      <section className="max-w-4xl mx-auto">
        <AdminUserEdit initialUser={user} />
      </section>

      <section className="max-w-5xl mx-auto">
        <AdminFineList fines={adminFines} />
      </section>
    </div>
  );
}
