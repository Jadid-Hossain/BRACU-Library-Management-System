import React from "react";
import { db } from "@/database/drizzle";
import { books, borrowRecords, holds } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BorrowBook from "@/components/BorrowBook";
import HoldBook from "@/components/HoldBook";
import ReturnBook from "@/components/ReturnBook";
import dayjs from "dayjs";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  const [bookDetails] = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      description: books.description,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      createdAt: books.createdAt,
      videoUrl: books.videoUrl,
      summary: books.summary,
    })
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  const [record] = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
    })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    )
    .limit(1);

  const [existingHold] = await db
    .select({ id: holds.id })
    .from(holds)
    .where(
      and(
        eq(holds.bookId, id),
        eq(holds.userId, userId),
        eq(holds.status, "ACTIVE"),
      ),
    )
    .limit(1);

  return (
    <>
      <BookOverview {...bookDetails} userId={userId} showBorrowButton={false} />

      <div className="book-details flex flex-col gap-10 mt-10">
        {/* Video & Summary */}
        <div className="flex flex-col gap-10">
          <section>
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>

          <section>
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {!record && (
            <>
              {bookDetails.availableCopies > 0 && !existingHold && (
                <HoldBook userId={userId} bookId={id} />
              )}

              {(bookDetails.availableCopies > 0 || existingHold) && (
                <BorrowBook
                  userId={userId}
                  bookId={id}
                  borrowingEligibility={{ isEligible: true, message: "" }}
                />
              )}

              {bookDetails.availableCopies === 0 && !existingHold && (
                <p className="text-gray-400">
                  This book is currently unavailable.
                </p>
              )}
            </>
          )}

          {record && (
            <section className="mt-10">
              <h3 className="text-xl font-semibold text-gray-200">
                Your Borrow
              </h3>
              <p className="text-gray-200">
                Borrowed on: {dayjs(record.borrowDate).format("MMMM D, YYYY")}
              </p>
              <p className="text-gray-200">
                Due on: {dayjs(record.dueDate).format("MMMM D, YYYY")}
              </p>
              {record.returnDate ? (
                <p className="mt-4 text-green-400">
                  Returned on: {dayjs(record.returnDate).format("MMMM D, YYYY")}
                </p>
              ) : (
                <div className="mt-4">
                  <ReturnBook recordId={record.id} bookId={id} />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
