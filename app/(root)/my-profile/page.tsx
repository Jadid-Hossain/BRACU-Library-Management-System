// app/your-path/page.tsx
import React from "react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books as booksTable } from "@/database/schema";
import type { Book } from "@/types";

export default async function Page() {
  // 1) Fetch all books from Postgres via Drizzle
  const allBooks = await db.select().from(booksTable);

  // 2) Map to your UI Book type (adding `video` alias for `videoUrl`)
  const books: Book[] = allBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    rating: b.rating,
    totalCopies: b.totalCopies,
    availableCopies: b.availableCopies,
    description: b.description,
    coverUrl: b.coverUrl,
    coverColor: b.coverColor,
    video: b.videoUrl, // <-- your BookList expects `.video`
    videoUrl: b.videoUrl, // <-- if your `Book` type still has `.videoUrl`
    summary: b.summary,
    createdAt: b.createdAt,
  }));

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <BookList title="Borrowed Books" books={books} />
    </div>
  );
}
