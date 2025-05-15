"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { holdBook } from "@/lib/actions/hold";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  userId: string;
  bookId: string;
}

export default function HoldBook({ userId, bookId }: Props) {
  const [holding, setHolding] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleHold = async () => {
    setHolding(true);
    setError("");

    try {
      const result = await holdBook({ userId, bookId });
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to place a hold");
      }
    } catch (err) {
      console.error("holdBook error:", err);
      setError("An unexpected error occurred");
    } finally {
      setHolding(false);
    }
  };

  return (
    <div className="hold-book-wrapper">
      <Button
        onClick={handleHold}
        disabled={holding}
        className="book-overview_btn"
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {holding ? "Holding..." : "Hold Book"}
        </p>
      </Button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
