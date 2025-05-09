"use client";

import React from "react";

export type AdminFineItem = {
  id: string;
  bookTitle: string;
  amount: number;
  reason: string;
  status: "PENDING" | "PAID" | "WAIVED";
  issuedAt: string;
  paidAt: string | null;
};

interface AdminFineListProps {
  fines: AdminFineItem[];
}

export default function AdminFineList({ fines }: AdminFineListProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">User Fine History</h3>
      {fines.length === 0 ? (
        <p className="text-gray-500">No fines found for this user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Book</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Issued</th>
                <th className="px-4 py-2 text-left">Paid</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.id} className="border-t">
                  <td className="px-4 py-2">{fine.bookTitle}</td>
                  <td className="px-4 py-2">${fine.amount}</td>
                  <td className="px-4 py-2">{fine.reason}</td>
                  <td className="px-4 py-2">
                    {new Date(fine.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {fine.paidAt
                      ? new Date(fine.paidAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-semibold px-2 py-1 rounded-full text-sm 
                        ${
                          fine.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : fine.status === "WAIVED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                    >
                      {fine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
