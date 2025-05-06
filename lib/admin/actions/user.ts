"use server";

import { eq } from "drizzle-orm";
import { users, STATUS_ENUM, ROLE_ENUM } from "@/database/schema";
import { db } from "@/database/drizzle";

export type UserParams = {
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "USER" | "ADMIN";
};

export const deleteUser = async (id: string) => {
  try {
    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("deleteUser error:", error);
    return {
      success: false,
      message: "An error occurred while deleting the user",
    };
  }
};

export const updateUser = async (id: string, params: UserParams) => {
  try {
    // ensure it exists
    const [orig] = await db.select().from(users).where(eq(users.id, id));
    if (!orig) {
      return { success: false, message: "User not found" };
    }

    await db
      .update(users)
      .set({
        fullName: params.fullName,
        email: params.email,
        universityId: params.universityId,
        universityCard: params.universityCard,
        status: params.status,
        role: params.role,
      })
      .where(eq(users.id, id));

    return { success: true };
  } catch (error: any) {
    console.error("updateUser error:", error);
    return {
      success: false,
      message: "An error occurred while updating the user",
    };
  }
};
