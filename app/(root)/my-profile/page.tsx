import React from "react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import type { Book } from "@/types";

const books: Book[] = sampleBooks.map((book) => ({
  ...book,
  video: book.videoUrl,
}));
import BookList from "@/components/BookList";

const Page = () => {
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
};
export default Page;
