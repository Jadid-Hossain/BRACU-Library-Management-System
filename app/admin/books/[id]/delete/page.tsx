// app/admin/books/[id]/delete/page.tsx
import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { deleteBook } from "@/lib/admin/actions/book";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const [exists] = await db
    .select({ id: books.id })
    .from(books)
    .where(eq(books.id, params.id));

  if (!exists) {
    notFound();
  }

  const result = await deleteBook(params.id);
  if (!result.success) {
    throw new Error("Failed to delete book");
  }

  redirect("/admin/books");
}
