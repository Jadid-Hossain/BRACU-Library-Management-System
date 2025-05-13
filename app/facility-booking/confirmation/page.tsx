'use client';

import Link from 'next/link';

export default function Confirmation() {
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
            <div className="text-red-600 font-semibold">524211</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Room category:</div>
            <div>Individual Study Pod for Student</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Room no:</div>
            <div>SP-01</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Location:</div>
            <div>9th Floor, Ayesha Abed Library, BracU</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Date:</div>
            <div>May 5, 2025</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="text-gray-600">Your reserved slots:</div>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
              10:10 AM - 11:10 AM
            </div>
          </div>
        </div>

        <p className="mt-6 text-red-600 text-xs md:text-sm">
          If you don't arrive within 10 minutes after the starting time, your reservation will be canceled.
        </p>
      </div>
    </div>
  );
}