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
  pendingFine: boolean;
}

interface Props {
  initialRecords: BorrowRecord[];
}

export default function AdminBorrowRecordList({ initialRecords }: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fineBorrowId, setFineBorrowId] = useState<string | null>(null);
  const [fineAmount, setFineAmount] = useState("");
  const [fineReason, setFineReason] = useState("");

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

  const waiveFine = async (borrowRecordId: string) => {
    try {
      const res = await fetch("/api/fines/waive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowRecordId }),
      });

      if (res.ok) {
        alert("Fine waived successfully!");
        setRecords((rs) =>
          rs.map((r) =>
            r.id === borrowRecordId ? { ...r, pendingFine: false } : r,
          ),
        );
      } else {
        alert("Failed to waive fine.");
      }
    } catch (err) {
      console.error(err);
      alert("Error waiving fine.");
    }
  };

  const submitFine = async () => {
    if (!fineAmount || !fineReason || !fineBorrowId) return;

    try {
      const res = await fetch("/api/fines/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrowRecordId: fineBorrowId,
          amount: Number(fineAmount),
          reason: fineReason,
        }),
      });

      if (res.ok) {
        alert("Fine added successfully!");
        setRecords((rs) =>
          rs.map((r) =>
            r.id === fineBorrowId ? { ...r, pendingFine: true } : r,
          ),
        );
        setShowForm(false);
        setFineBorrowId(null);
        setFineAmount("");
        setFineReason("");
      } else {
        alert("Failed to add fine.");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding fine.");
    }
  };

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
              <th className="px-4 py-2 text-left">Actions</th>
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
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setFineBorrowId(record.id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Fine
                  </button>
                  {record.pendingFine && (
                    <button
                      onClick={() => waiveFine(record.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Waive Fine
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="mt-4 text-gray-500">No borrow records found.</p>
        )}
      </div>

      {/* Fine Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Add Fine</h3>
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Reason</label>
            <textarea
              value={fineReason}
              onChange={(e) => setFineReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitFine}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
