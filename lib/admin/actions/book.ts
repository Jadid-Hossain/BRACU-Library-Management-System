"use server";

import { eq } from "drizzle-orm";
import { books } from "@/database/schema";
import { db } from "@/database/drizzle";

export type BookParams = {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
};

export const createBook = async (params: BookParams) => {
  try {
    const [newBook] = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook)),
    };
  } catch (error: any) {
    console.error("createBook error:", error);
    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: BookParams) => {
  try {
    const [orig] = await db.select().from(books).where(eq(books.id, id));

    if (!orig) {
      return { success: false, message: "Book not found" };
    }

    let newAvailable = orig.availableCopies;
    if (params.totalCopies !== orig.totalCopies) {
      if (params.totalCopies > orig.totalCopies) {
        newAvailable =
          orig.availableCopies + (params.totalCopies - orig.totalCopies);
      } else {
        newAvailable = Math.min(orig.availableCopies, params.totalCopies);
      }
    }

    await db
      .update(books)
      .set({
        title: params.title,
        author: params.author,
        genre: params.genre,
        rating: params.rating,
        coverUrl: params.coverUrl,
        coverColor: params.coverColor,
        description: params.description,
        totalCopies: params.totalCopies,
        availableCopies: newAvailable,
        videoUrl: params.videoUrl,
        summary: params.summary,
      })
      .where(eq(books.id, id));

    return { success: true };
  } catch (error: any) {
    console.error("updateBook error:", error);
    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await db.delete(books).where(eq(books.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("deleteBook error:", error);
    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};
