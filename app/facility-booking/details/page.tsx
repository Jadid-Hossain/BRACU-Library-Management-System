'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function FacilityDetails() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Individual Study Pods and Group Discussion Rooms</h1>
        </div>
      </div>

      {/* Individual Study Pods Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8">
                <Image
                  src="/individual-pod-icon.png"
                  alt="Individual Study Pod Icon"
                  width={32}
                  height={32}
                />
              </div>
              <h2 className="text-2xl font-bold">Individual Study Pods:</h2>
            </div>
            <p className="mb-6">
              Library individual study pods are small, private areas that help students and faculty focus on their work without disturbances, providing a comfortable place to study on their own.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-4">Please note:</p>
              <ul className="space-y-3">
                <li>These spaces must be booked through the <Link href="/facility-booking" className="text-blue-600 hover:text-blue-800">online booking system</Link>.</li>
                <li>Reservation requests can be made up to 7 days in advance.</li>
                <li>If you make a booking but change your mind or no longer require the use of a pod or group discussion room, please cancel your booking online or by contacting us.</li>
                <li>If no one cancels a library room booking and the scheduled user does not show up, users may lose their room booking privileges in the future.</li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/study-pod-image.jpg"
              alt="Individual Study Pod"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Group Discussion Rooms Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/2">
            <Image
              src="/group-room-image.jpg"
              alt="Group Discussion Room"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8">
                <Image
                  src="/group-room-icon.png"
                  alt="Group Discussion Room Icon"
                  width={32}
                  height={32}
                />
              </div>
              <h2 className="text-2xl font-bold">Group Discussion Rooms:</h2>
            </div>
            <p className="mb-6">
              Library group discussion rooms are available only for BRAC University faculty and students to meet and collaborate on their projects.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-4">Please note:</p>
              <ul className="space-y-3">
                <li>These spaces must be booked through the <Link href="/facility-booking" className="text-blue-600 hover:text-blue-800">online booking system</Link>.</li>
                <li>Reservation requests can be made up to 7 days in advance.</li>
                <li>If you make a booking but change your mind or no longer require the use of a pod or group discussion room, please cancel your booking online or by contacting us.</li>
                <li>If no one cancels a library room booking and the scheduled user does not show up, users may lose their room booking privileges in the future.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Terms and Conditions:</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-3">
            <li><strong>Library Membership:</strong> Required for all users.</li>
            <li><strong>Punctuality:</strong> Reservations will be canceled if you don't arrive within 10 minutes of the start time.</li>
            <li><strong>Usage Guidelines:</strong> Rooms are for group study only; not for student meetings, debate practice, drama practice, preparing poster/cardboard presentations, or lab experiments. Bookings require a minimum of 3 attendees.</li>
            <li><strong>Booking Rules:</strong> Reserve rooms up to one day in advance, twice daily with different groups. Maximum of 2 slots per person per day. No subletting allowed.</li>
            <li><strong>Food & Cleanliness:</strong> Only water is permitted. Clean up and remove personal items; items left behind go to Lost and Found.</li>
            <li><strong>Noise Control:</strong> Excessive noise or disruptive behavior will result in removal.</li>
            <li><strong>Room Management:</strong> Do not rearrange or add furniture. Report any damages immediately.</li>
            <li><strong>Time Limits:</strong> Reservations are for 60 minutes, extendable if no other groups are waiting.</li>
            <li><strong>Access and Monitoring:</strong> Library staff may access rooms for checks and maintenance.</li>
            <li><strong>General Conduct:</strong> Silence mobile devices, no sticking materials on walls, and comply with all library rules.</li>
          </ul>
          <p className="mt-4">Groups are responsible for cleaning up after themselves and removing all personal items when leaving the study room. Any items left behind will be placed in the Lost and Found.</p>
        </div>
      </div>
    </div>
  );
}