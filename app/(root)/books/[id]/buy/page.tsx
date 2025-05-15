"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface BuyFormData {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function BuyBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<BuyFormData>({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically integrate with a payment processor
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Purchase completed successfully!",
      });
      router.push(`/books/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during purchase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Button asChild className="mb-6">
        <Link href={`/books/${params.id}`}>← Back to Book</Link>
      </Button>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Purchase Book</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Shipping Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Card Number</label>
            <Input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              className="w-full"
              maxLength={16}
              pattern="\d{16}"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Expiry Date
              </label>
              <Input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                className="w-full"
                placeholder="MM/YY"
                maxLength={5}
                pattern="\d{2}/\d{2}"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">CVV</label>
              <Input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                className="w-full"
                maxLength={3}
                pattern="\d{3}"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Complete Purchase"}
          </Button>
        </form>
      </div>
    </div>
  );
} 