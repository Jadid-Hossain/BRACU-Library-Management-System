"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getReservationPosition, cancelReservation } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Props {
  userId: string;
  bookId: string;
}

const ReservationStatus = ({ userId, bookId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const result = await getReservationPosition(userId, bookId);
        if (result.success) {
          setReservation(result.reservation);
        } else {
          setError(result.error || "Failed to load reservation information");
        }
      } catch (error) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [userId, bookId]);

  const handleCancelReservation = async () => {
    if (!reservation) return;
    
    try {
      const result = await cancelReservation(reservation.id);
      if (result.success) {
        router.refresh();
      } else {
        setError("Failed to cancel reservation");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading reservation status...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  if (!reservation) {
    return null;
  }

  // WAITING status
  if (reservation.status === "WAITING") {
    return (
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-300">Your Reservation</h3>
        <p className="text-gray-200 mt-2">
          Reserved on: {dayjs(reservation.reservationDate).format("MMMM D, YYYY")}
        </p>
        <p className="text-gray-200">
          Position in queue: {reservation.queuePosition === 0 
            ? "You're next in line!" 
            : `${reservation.queuePosition + 1} of ${reservation.position}`}
        </p>
        <Button onClick={handleCancelReservation} className="mt-3 bg-red-500 hover:bg-red-600">
          Cancel Reservation
        </Button>
      </div>
    );
  }

  // READY status
  if (reservation.status === "READY") {
    const expiryDate = dayjs(reservation.expiryDate);
    const daysLeft = expiryDate.diff(dayjs(), 'day');
    const hoursLeft = expiryDate.diff(dayjs(), 'hour') % 24;
    
    return (
      <div className="mt-6 p-4 bg-green-900/30 rounded-lg">
        <h3 className="text-xl font-semibold text-green-300">Book Available!</h3>
        <p className="text-gray-200 mt-2">
          Your reserved book is now available for borrowing.
        </p>
        <p className="text-yellow-300 mt-1">
          Time remaining: {daysLeft > 0 ? `${daysLeft} days` : ""} {hoursLeft} hours
        </p>
        <div className="mt-3 flex gap-3">
          <Button className="bg-green-500 hover:bg-green-600" onClick={() => router.push(`/books/${bookId}`)}>
            Borrow Now
          </Button>
          <Button 
            onClick={handleCancelReservation} 
            variant="outline"
            className="text-red-400 border-red-400 hover:bg-red-500/10"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ReservationStatus; 