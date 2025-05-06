"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "USER" | "ADMIN";
  lastActivityDate: string; // date as ISO string
}

interface Props {
  initialUsers: User[];
}

export default function AdminUserList({ initialUsers }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Delete handler with confirmation
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await deleteUser(id);
    if (res.success) {
      toast({ title: "Deleted", description: "User has been removed." });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: res.message || "Failed to delete the user.",
        variant: "destructive",
      });
    }
  };

  // Filter by name or email
  useEffect(() => {
    if (!search.trim()) {
      setUsers(initialUsers);
    } else {
      const q = search.toLowerCase();
      setUsers(
        initialUsers.filter(
          (u) =>
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, initialUsers]);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Users</h2>
      </div>

      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-right">Univ. ID</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-right">{u.universityId}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.status}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  {/* Blue “Edit” button */}
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                    asChild
                  >
                    <Link href={`/admin/users/${u.id}/edit`}>Edit</Link>
                  </Button>

                  {/* Red “Delete” button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="mt-4 text-gray-500">No users found.</p>
        )}
      </div>
    </section>
  );
}
