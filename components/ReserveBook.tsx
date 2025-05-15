"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { reserveBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  bookId: string;
}

const ReserveBook = ({ userId, bookId }: Props) => {
  const [reserving, setReserving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleReserveBook = async () => {
    setReserving(true);

    try {
      const result = await reserveBook({ bookId, userId });

      if (result.success) {
        setSuccess(true);
        setShowDialog(true);
        setDialogMessage("Book reserved successfully! You'll be notified when it becomes available.");
        router.refresh();
      } else {
        setShowDialog(true);
        setDialogMessage(
          result.error || "An error occurred while reserving the book"
        );
      }
    } catch (error) {
      setShowDialog(true);
      setDialogMessage("An unexpected error occurred while reserving the book");
    } finally {
      setReserving(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Button
        className="book-overview_btn"
        onClick={handleReserveBook}
        disabled={reserving}
        variant="outline"
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {reserving ? "Reserving ..." : "Reserve Book"}
        </p>
      </Button>

      {showDialog && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className={`text-xl font-semibold text-center ${success ? 'text-green-600' : 'text-red-600'}`}>
              {success ? "Book Reserved" : "Cannot Reserve Book"}
            </h3>
            <p className="mt-4 text-center">{dialogMessage}</p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleCloseDialog}
                className={success ? "bg-green-500 text-white" : "bg-red-500 text-white"}
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

export default ReserveBook; 