'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type BookingDetails = {
  code: string;
  facility: string;
  room: string;
  date: string;
  formattedDate?: string;
  slots: Array<{ label: string, value: string }>;
};

export default function Confirmation() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  
  useEffect(() => {
    // Retrieve booking details from session storage
    if (typeof window !== 'undefined') {
      const details = sessionStorage.getItem('reservationDetails');
      console.log('Confirmation page - Retrieved reservation details:', details);
      if (details) {
        try {
          const parsedDetails = JSON.parse(details);
          console.log('Confirmation page - Parsed details:', parsedDetails);
          // Format the date if it's a Date object stored as a string
          if (parsedDetails.date) {
            const date = new Date(parsedDetails.date);
            console.log('Confirmation page - Parsed date:', date);
            parsedDetails.formattedDate = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            console.log('Confirmation page - Formatted date:', parsedDetails.formattedDate);
          }
          setBooking(parsedDetails);
        } catch (error) {
          console.error('Error parsing reservation details:', error);
        }
      } else {
        console.warn('Confirmation page - No reservation details found in session storage');
      }
    }
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center py-6 md:py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 md:p-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Booking Information Not Found</h1>
          <p className="mb-6">Please return to the booking page to make a new reservation.</p>
          <Link href="/facility-booking" className="text-blue-600 hover:text-blue-800 block text-center mb-6 text-sm md:text-base">
            Go to Booking Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center py-6 md:py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ayesha Abed Library</h1>
        </div>

        <Link href="/" className="text-blue-600 hover:text-blue-800 block text-center mb-6 text-sm md:text-base">
          Go to homepage
        </Link>

        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-800 text-sm md:text-base">Your reservation is successfully done!</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Reservation Code:</div>
            <div className="text-red-600 font-semibold">{booking.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Room category:</div>
            <div>{booking.facility}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Room no:</div>
            <div>{booking.room}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Location:</div>
            <div>9th Floor, Ayesha Abed Library, BracU</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Date:</div>
            <div>{booking.formattedDate}</div>
          </div>

          <div className="grid grid-1 gap-2 text-sm md:text-base">
            <div className="text-gray-600">Your reserved slots:</div>
            {booking.slots.map((slot, index) => (
              <div key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded">
                {slot.label}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-red-600 text-xs md:text-sm">
          If you don't arrive within 10 minutes after the starting time, your reservation will be canceled.
        </p>
      </div>
    </div>
  );
}