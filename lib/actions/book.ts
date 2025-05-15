"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users, reservations } from "@/database/schema";
import { eq, and, asc, lt } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const [user] = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.status !== "APPROVED") {
      return {
        success: false,
        error: "Only approved users can borrow books",
      };
    }

    // Check if this user has a ready reservation
    const [userReservation] = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.userId, userId),
          eq(reservations.bookId, bookId),
          eq(reservations.status, "READY")
        )
      )
      .limit(1);

    // Regular borrowing flow - check available copies
    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if ((!book || book.availableCopies <= 0) && !userReservation) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const [existingBorrow] = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED"),
        ),
      )
      .limit(1);

    if (existingBorrow) {
      return {
        success: false,
        error: "You've already borrowed this book",
      };
    }

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    // If user had a reservation, update its status
    if (userReservation) {
      await db
        .update(reservations)
        .set({ status: "BORROWED" })
        .where(eq(reservations.id, userReservation.id));
    } else {
      // Only decrement available copies if no reservation was used
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies - 1 })
        .where(eq(books.id, bookId));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error: any) {
    console.error("borrowBook error:", error);
    return { success: false, error: error.message };
  }
};

export const returnBook = async (params: ReturnBookParams) => {
  const { recordId, bookId } = params;

  try {
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: dayjs().format("YYYY-MM-DD"),
      })
      .where(eq(borrowRecords.id, recordId));

    const [bookRow] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    // Increment the available copies
    await db
      .update(books)
      .set({ availableCopies: bookRow.availableCopies + 1 })
      .where(eq(books.id, bookId));

    // Check if there are any waiting reservations
    const [nextReservation] = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "WAITING")
        )
      )
      .orderBy(asc(reservations.position))
      .limit(1);

    // If there's a waiting reservation, update it to READY and set expiry
    if (nextReservation) {
      const expiryDate = dayjs().add(2, "day").toDate();
      
      await db
        .update(reservations)
        .set({
          status: "READY",
          expiryDate
        })
        .where(eq(reservations.id, nextReservation.id));
        
      // Reserve this copy by decrementing the available copies
      await db
        .update(books)
        .set({ availableCopies: bookRow.availableCopies })
        .where(eq(books.id, bookId));
    }

    return { success: true };
  } catch (error: any) {
    console.error("returnBook error:", error);
    return { success: false, error: "Failed to return book" };
  }
};

export const reserveBook = async (params: ReserveBookParams) => {
  const { userId, bookId } = params;

  try {
    const [user] = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.status !== "APPROVED") {
      return {
        success: false,
        error: "Only approved users can reserve books",
      };
    }

    // Check if user already has an active reservation for this book
    const [existingReservation] = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.userId, userId),
          eq(reservations.bookId, bookId),
          eq(reservations.status, "WAITING")
        )
      )
      .limit(1);

    if (existingReservation) {
      return {
        success: false,
        error: "You already have an active reservation for this book",
      };
    }

    // Check if user already has this book borrowed
    const [existingBorrow] = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED"),
        ),
      )
      .limit(1);

    if (existingBorrow) {
      return {
        success: false,
        error: "You've already borrowed this book",
      };
    }

    // Get the last position in the queue
    const [lastReservation] = await db
      .select({ position: reservations.position })
      .from(reservations)
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "WAITING")
        )
      )
      .orderBy(reservations.position)
      .limit(1);

    const position = lastReservation ? lastReservation.position + 1 : 1;

    // Create the reservation
    const record = await db.insert(reservations).values({
      userId,
      bookId,
      position,
      status: "WAITING",
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error: any) {
    console.error("reserveBook error:", error);
    return { success: false, error: error.message };
  }
};

export const cancelReservation = async (reservationId: string) => {
  try {
    await db
      .update(reservations)
      .set({ status: "CANCELLED" })
      .where(eq(reservations.id, reservationId));

    return { success: true };
  } catch (error: any) {
    console.error("cancelReservation error:", error);
    return { success: false, error: "Failed to cancel reservation" };
  }
};

export const getReservationPosition = async (userId: string, bookId: string) => {
  try {
    // Get the user's current reservation if it exists
    const [userReservation] = await db
      .select({
        id: reservations.id,
        position: reservations.position,
        status: reservations.status,
        expiryDate: reservations.expiryDate,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.userId, userId),
          eq(reservations.bookId, bookId),
          eq(reservations.status, "WAITING")
        )
      )
      .limit(1);

    if (!userReservation) {
      return { success: true, reservation: null };
    }

    // Count how many people are ahead in the queue
    const aheadReservations = await db
      .select({ position: reservations.position })
      .from(reservations)
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "WAITING"),
          lt(reservations.position, userReservation.position)
        )
      )
      .execute();

    const queuePosition = aheadReservations.length;

    return {
      success: true,
      reservation: {
        ...userReservation,
        queuePosition
      }
    };
  } catch (error: any) {
    console.error("getReservationPosition error:", error);
    return { success: false, error: "Failed to get reservation position" };
  }
};

// Check for expired reservations and update them
export const processExpiredReservations = async () => {
  try {
    const now = new Date();
    
    // Get all expired READY reservations
    const expiredReservations = await db
      .select({
        id: reservations.id,
        bookId: reservations.bookId,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.status, "READY"),
          lt(reservations.expiryDate, now)
        )
      );

    for (const reservation of expiredReservations) {
      // Update status to EXPIRED
      await db
        .update(reservations)
        .set({ status: "EXPIRED" })
        .where(eq(reservations.id, reservation.id));

      // Get the book
      const [book] = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, reservation.bookId));

      // Increment available copies since reservation expired
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, reservation.bookId));

      // Check for next waiting reservation
      const [nextReservation] = await db
        .select()
        .from(reservations)
        .where(
          and(
            eq(reservations.bookId, reservation.bookId),
            eq(reservations.status, "WAITING")
          )
        )
        .orderBy(asc(reservations.position))
        .limit(1);

      // If there's someone waiting, give them the book
      if (nextReservation) {
        const expiryDate = dayjs().add(2, "day").toDate();
        
        await db
          .update(reservations)
          .set({
            status: "READY",
            expiryDate
          })
          .where(eq(reservations.id, nextReservation.id));
          
        // Reserve this copy for them
        await db
          .update(books)
          .set({ availableCopies: book.availableCopies })
          .where(eq(books.id, reservation.bookId));
      }
    }

    return { success: true, processed: expiredReservations.length };
  } catch (error: any) {
    console.error("processExpiredReservations error:", error);
    return { success: false, error: "Failed to process expired reservations" };
  }
};
