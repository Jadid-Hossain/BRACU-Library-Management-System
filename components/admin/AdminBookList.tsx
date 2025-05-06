"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
}

interface Props {
  initialBooks: Book[];
}

export default function AdminBookList({ initialBooks }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const res = await deleteBook(id);
    if (res.success) {
      toast({ title: "Deleted", description: "Book has been removed." });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: res.message || "Failed to delete the book.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setBooks(initialBooks);
    } else {
      const q = search.toLowerCase();
      setBooks(
        initialBooks.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, initialBooks]);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by title or author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-left">Genre</th>
              <th className="px-4 py-2 text-right">Rating</th>
              <th className="px-4 py-2 text-right">Available / Total</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t">
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.author}</td>
                <td className="px-4 py-2">{book.genre}</td>
                <td className="px-4 py-2 text-right">{book.rating}</td>
                <td className="px-4 py-2 text-right">
                  {book.availableCopies} / {book.totalCopies}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                    asChild
                  >
                    <Link href={`/admin/books/${book.id}/edit`}>Edit</Link>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <p className="mt-4 text-gray-500">No books found.</p>
        )}
      </div>
    </section>
  );
}
