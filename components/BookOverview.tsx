import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";

interface Props extends Book {
  userId: string;
  showBorrowButton?: boolean;
  createdAt: string;
  isHomepage?: boolean;
}

const BookOverview = async ({
  id,
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  createdAt,
  userId,
  showBorrowButton = true,
  isHomepage = false,
}: Props) => {
  const [user] = await db
    .select({ role: users.role, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [existingBorrow] = await db
    .select({ id: borrowRecords.id })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.status, "BORROWED"),
      ),
    )
    .limit(1);

  const now = dayjs();
  const created = dayjs(createdAt);
  const cutoff = created.add(2, "day");
  const inPriorityWindow = now.isBefore(cutoff);
  const hoursLeft = Math.ceil(cutoff.diff(now, "hour", true));

  const isEligible =
    availableCopies > 0 &&
    user?.status === "APPROVED" &&
    !existingBorrow &&
    (!inPriorityWindow || user.role === "FACULTY");

  let message = "";
  if (!isEligible) {
    if (existingBorrow) {
      message = "You’ve already borrowed this book";
    } else if (availableCopies <= 0) {
      message = "Book is not available";
    } else if (inPriorityWindow && user.role !== "FACULTY") {
      message = `Only faculty may borrow in the first 48h. Available in ~${hoursLeft}h.`;
    } else {
      message = "You are not eligible to borrow this book";
    }
  }

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        {isHomepage ? (
          <Link href={`/books/${id}`}>
            <h1 className="hover:underline cursor-pointer">{title}</h1>
          </Link>
        ) : (
          <h1>{title}</h1>
        )}

        {inPriorityWindow && (
          <p className="text-sm font-semibold text-yellow-400">
            Newly Released Book!
          </p>
        )}

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>
          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>
          <div className="flex flex-row gap-1">
            <img src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>
          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {user && showBorrowButton && (
          <BorrowBook
            bookId={id}
            userId={userId}
            borrowingEligibility={{ isEligible, message }}
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
