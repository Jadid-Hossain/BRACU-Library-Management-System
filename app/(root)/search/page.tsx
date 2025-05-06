// app/(root)/search/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  summary: string;
  totalCopies: number;
  availableCopies: number;
};

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [results, setResults] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Fetch books & derive genres once
  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setGenres(Array.from(new Set(data.map((b) => b.genre))).sort());
      });
  }, []);

  // Re-compute results whenever any filter changes
  useEffect(() => {
    let filtered = books;

    const q = search.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }

    if (genreFilter !== "All") {
      filtered = filtered.filter((b) => b.genre === genreFilter);
    }

    if (onlyAvailable) {
      filtered = filtered.filter((b) => b.availableCopies > 0);
    }

    setResults(filtered);
  }, [search, books, genreFilter, onlyAvailable]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-200">
        Search Books
      </h1>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row items-start gap-4 mb-8 w-full max-w-7xl mx-auto">
        {/* search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type title or author…"
          className="flex-1 block w-full p-4 border border-gray-300 rounded"
        />

        {/* genre dropdown */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-4 border border-gray-300 rounded bg-white"
        >
          <option value="All">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* availability checkbox */}
        <label className="flex items-center gap-2 text-gray-100">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="h-5 w-5"
          />
          Only show available
        </label>
      </div>

      {/* Results */}
      {search.trim() === "" && !onlyAvailable && genreFilter === "All" ? (
        <p className="text-gray-500">Start typing or choose a filter above.</p>
      ) : results.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No books found with those criteria.</p>
      )}
    </div>
  );
}
