"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { borrowBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const [borrowing, setBorrowing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const router = useRouter();

  const handleBorrowBook = async () => {
    if (!isEligible) {
      setShowDialog(true);
      setDialogMessage(message);
      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        console.log("Book borrowed successfully");
        router.refresh();
      } else {
        setShowDialog(true);
        setDialogMessage(
          result.error || "An error occurred while borrowing the book",
        );
      }
    } catch (error) {
      setShowDialog(true);
      setDialogMessage("An unexpected error occurred while borrowing the book");
    } finally {
      setBorrowing(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Button
        className="book-overview_btn"
        onClick={handleBorrowBook}
        disabled={borrowing}
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {borrowing ? "Borrowing ..." : "Borrow Book"}
        </p>
      </Button>

      {showDialog && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-center text-red-600">
              Cannot Borrow Book
            </h3>
            <p className="mt-4 text-center">{dialogMessage}</p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleCloseDialog}
                className="bg-red-500 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BorrowBook;
