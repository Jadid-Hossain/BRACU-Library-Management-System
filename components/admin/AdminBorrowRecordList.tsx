"use client";

import React, { useState, useEffect } from "react";

interface BorrowRecord {
  id: string;
  userName?: string | null;
  bookTitle?: string | null;
  status: "BORROWED" | "RETURNED";
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
}

interface Props {
  initialRecords: BorrowRecord[];
}

export default function AdminBorrowRecordList({ initialRecords }: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = search.toLowerCase();
    setRecords(
      initialRecords.filter(
        (r) =>
          (r.userName?.toLowerCase().includes(q) ?? false) ||
          (r.bookTitle?.toLowerCase().includes(q) ?? false),
      ),
    );
  }, [search, initialRecords]);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Borrow Records</h2>
      </div>

      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by user or book title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Book</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Borrow Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="px-4 py-2">{record.userName ?? "—"}</td>
                <td className="px-4 py-2">{record.bookTitle ?? "—"}</td>
                <td className="px-4 py-2">{record.status}</td>
                <td className="px-4 py-2">
                  {new Date(record.borrowDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(record.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {record.returnDate
                    ? new Date(record.returnDate).toLocaleDateString()
                    : "Not Yet Returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="mt-4 text-gray-500">No borrow records found.</p>
        )}
      </div>
    </section>
  );
}
