"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type FineItem = {
  id: string;
  bookId: string;
  bookTitle: string;
  amount: number;
  reason: string;
  status: "PENDING" | "PAID" | "WAIVED";
  issuedAt: string; // ISO
  paidAt: string | null;
  borrowStatus: "BORROWED" | "RETURNED";
};

export default function FineList({
  initialFines,
}: {
  initialFines: FineItem[];
}) {
  const [fines, setFines] = useState<FineItem[]>(initialFines);
  const [payingAll, setPayingAll] = useState(false);
  const router = useRouter();

  const pendingFines = fines.filter((f) => f.status === "PENDING");
  const payableFines = pendingFines.filter(
    (f) => f.borrowStatus === "RETURNED",
  );

  const totalFine = pendingFines.reduce((sum, f) => sum + f.amount, 0);
  const totalPayable = payableFines.reduce((sum, f) => sum + f.amount, 0);

  const payFine = async (fineId: string) => {
    const res = await fetch("/api/fines/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fineId }),
    });

    if (res.ok) {
      setFines((prev) =>
        prev.map((f) =>
          f.id === fineId
            ? { ...f, status: "PAID", paidAt: new Date().toISOString() }
            : f,
        ),
      );
      router.refresh();
    }
  };

  const payAllFines = async () => {
    if (payableFines.length === 0) return;
    setPayingAll(true);

    await Promise.all(
      payableFines.map((f) =>
        fetch("/api/fines/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: f.id }),
        }).then((res) => {
          if (res.ok) {
            setFines((prev) =>
              prev.map((x) =>
                x.id === f.id
                  ? { ...x, status: "PAID", paidAt: new Date().toISOString() }
                  : x,
              ),
            );
          }
        }),
      ),
    );

    setPayingAll(false);
    router.refresh();
  };

  const sorted = [
    ...payableFines,
    ...pendingFines.filter((f) => f.borrowStatus !== "RETURNED"),
    ...fines.filter((f) => f.status !== "PENDING"),
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">My Fines</h2>

      {pendingFines.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-lg font-semibold text-gray-100">
            Total Fine: ${totalFine}
          </p>
          <p className="text-lg font-semibold text-gray-100">
            Total Payable: ${totalPayable}
          </p>
          <p className="text-gray-300">
            You have {payableFines.length} payable fine
            {payableFines.length > 1 ? "s" : ""}.
          </p>
          <Button onClick={payAllFines} disabled={payingAll}>
            {payingAll ? "Paying All…" : "Pay All"}
          </Button>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-gray-300">You have no fines.</p>
      ) : (
        <ul className="space-y-4">
          {sorted.map((f) => (
            <li key={f.id} className="flex p-4 bg-gray-800 rounded">
              <div className="flex-1">
                <p className="font-semibold text-blue-500 mb-2">
                  {f.bookTitle}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Amount: ${f.amount}</span>
                    <span>Reason: {f.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Issued: {new Date(f.issuedAt).toLocaleDateString()}
                    </span>
                    <span>
                      {f.status === "PAID" && f.paidAt
                        ? `Paid: ${new Date(f.paidAt).toLocaleDateString()}`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center ml-4">
                {f.status === "PENDING" ? (
                  f.borrowStatus === "RETURNED" ? (
                    <Button onClick={() => payFine(f.id)}>Pay</Button>
                  ) : (
                    <Button
                      onClick={() => router.push(`/books/${f.bookId}`)}
                      className="text-red-400"
                    >
                      Return Book
                    </Button>
                  )
                ) : f.status === "WAIVED" ? (
                  <span className="font-bold text-yellow-400">Waived</span>
                ) : (
                  <span className="font-bold text-green-400">Paid</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
