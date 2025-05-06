// app/admin/users/page.tsx
import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import AdminUserList from "@/components/admin/AdminUserList";

export default async function Page() {
  const allUsers = await db.select().from(users);
  return <AdminUserList initialUsers={allUsers} />;
}
