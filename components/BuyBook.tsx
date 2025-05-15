"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

interface Props {
  bookId: string;
  title: string;
  price: number;
}

export default function BuyBook({ bookId, title, price }: Props) {
  return (
    <Link href={`/books/${bookId}/buy`}>
      <Button className="book-overview_btn mt-4 w-full">
        <Image src="/icons/shopping-cart.svg" alt="buy" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          Buy Book - ${price}
        </p>
      </Button>
    </Link>
  );
} 