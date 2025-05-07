"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { returnBook } from "@/lib/actions/book";

interface Props {
  recordId: string;
  bookId: string;
}

export default function ReturnBook({ recordId, bookId }: Props) {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleReturn = async () => {
    setReturning(true);
    const result = await returnBook({ recordId, bookId });
    if (result.success) {
      toast({ title: "Returned", description: "Book returned successfully" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    setReturning(false);
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleReturn}
      disabled={returning}
    >
      <Image src="/icons/return.svg" alt="return" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {returning ? "Returning..." : "Return Book"}
      </p>
    </Button>
  );
}
