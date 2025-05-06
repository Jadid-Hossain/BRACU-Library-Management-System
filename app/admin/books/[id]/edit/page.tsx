import React from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import AdminBookEdit from "@/components/admin/AdminBookEdit";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Fetch the existing book by ID
  const [book] = await db.select().from(books).where(eq(books.id, params.id));

  if (!book) {
    notFound();
  }

  return <AdminBookEdit initialBook={book} />;
}
