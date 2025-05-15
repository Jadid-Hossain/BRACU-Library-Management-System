import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { autoFineOverdues } from "@/lib/admin/actions/autoFine";
import { autoReleaseHolds } from "@/lib/actions/hold";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  after(async () => {
    if (!session?.user?.id) return;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
    console.log("Updated lastActivityDate for user", session.user.id);

    const result = await autoFineOverdues();
    console.log("autoFineOverdues result:", result);

    const rel = await autoReleaseHolds();
    console.log("autoReleaseHolds released:", rel.released);
  });

  return (
    <main className="root-container">
      <Header session={session} />
      <div className="mx-auto max-w-7xl">
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
