"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelReservation } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ReservationListItem {
  id: string;
  bookId: string;
  bookTitle: string;
  reservationDate: string;
  expiryDate: string | null;
  status: string;
  position: number;
}

interface Props {
  reservations: ReservationListItem[];
}

const UserReservations = ({ reservations }: Props) => {
  const router = useRouter();
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleCancelReservation = async (reservationId: string) => {
    setProcessingIds((prev) => [...prev, reservationId]);
    
    try {
      const result = await cancelReservation(reservationId);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    } finally {
      setProcessingIds((prev) => prev.filter(id => id !== reservationId));
    }
  };

  const handleBorrowBook = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  if (!reservations || reservations.length === 0) {
    return (
      <div className="rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Reservations</h2>
        <p className="text-gray-400">You don't have any active reservations.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-semibold">Your Reservations</h2>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className={`flex justify-between rounded-lg p-4 ${
              reservation.status === 'READY' 
                ? 'bg-green-900/30 border border-green-700/50' 
                : 'bg-gray-700'
            }`}
          >
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{reservation.bookTitle}</h3>
                <span className={`text-sm ${getStatusColor(reservation.status)}`}>
                  {getStatusDisplay(reservation.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mt-1">
                Reserved {dayjs(reservation.reservationDate).fromNow()}
              </p>
              
              {reservation.status === 'WAITING' && (
                <p className="text-sm text-gray-300">
                  Queue position: {reservation.position}
                </p>
              )}
              
              {reservation.status === 'READY' && reservation.expiryDate && (
                <p className="text-sm text-yellow-300 mt-1">
                  Available until: {dayjs(reservation.expiryDate).format('MMM D, YYYY h:mm A')}
                  <span className="text-xs ml-2">
                    ({dayjs(reservation.expiryDate).fromNow()})
                  </span>
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {reservation.status === 'READY' && (
                <Button 
                  onClick={() => handleBorrowBook(reservation.bookId)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Borrow
                </Button>
              )}
              
              {(reservation.status === 'WAITING' || reservation.status === 'READY') && (
                <Button 
                  variant="outline"
                  onClick={() => handleCancelReservation(reservation.id)}
                  disabled={processingIds.includes(reservation.id)}
                  className="text-red-400 border-red-400/30 hover:bg-red-500/10"
                >
                  {processingIds.includes(reservation.id) ? 'Cancelling...' : 'Cancel'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
function getStatusColor(status: string): string {
  switch (status) {
    case 'WAITING':
      return 'text-blue-400';
    case 'READY':
      return 'text-green-400';
    case 'BORROWED':
      return 'text-purple-400';
    case 'EXPIRED':
      return 'text-red-400';
    case 'CANCELLED':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
}

function getStatusDisplay(status: string): string {
  switch (status) {
    case 'WAITING':
      return 'In Queue';
    case 'READY':
      return 'Ready to Borrow';
    case 'BORROWED':
      return 'Borrowed';
    case 'EXPIRED':
      return 'Expired';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

export default UserReservations; 