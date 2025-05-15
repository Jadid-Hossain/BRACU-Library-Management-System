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
      className="book-overview_btn max-w-[200px] w-full overflow-hidden"
      onClick={handleReturn}
      disabled={returning}
    >
      <div className="flex items-center justify-center gap-2 w-full overflow-hidden">
        <Image
          src="/icons/book.svg"
          alt="return"
          width={20}
          height={20}
          className="shrink-0"
        />
        <p className="font-bebas-neue text-xl text-dark-100 truncate">
          {returning ? "Returning..." : "Return Book"}
        </p>
      </div>
    </Button>
  );
}
