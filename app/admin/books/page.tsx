import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import AdminBookList from "@/components/admin/AdminBookList";

export default async function Page() {
  const allBooks = await db.select().from(books);
  return <AdminBookList initialBooks={allBooks} />;
}
