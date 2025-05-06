import React from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import AdminUserEdit from "@/components/admin/AdminUserEdit";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const [user] = await db.select().from(users).where(eq(users.id, params.id));

  if (!user) {
    notFound();
  }

  return <AdminUserEdit initialUser={user} />;
}
