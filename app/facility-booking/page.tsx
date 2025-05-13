'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Home, Mail, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import sql from '@/lib/neon-db';
import "react-datepicker/dist/react-datepicker.css";

const facilities = [
  { value: 'faculty-pod', label: 'Individual Study Pod for Faculty' },
  { value: 'student-pod', label: 'Individual Study Pod for Student' },
  { value: 'group-3-4', label: 'Group Discussion Room for Student (3-4 persons)' },
  { value: 'group-faculty', label: 'Group Discussion Room for Faculty and Researcher' },
  { value: 'group-4-5', label: 'Group Discussion Room for Student (4-5 persons)' },
  { value: 'group-5-6', label: 'Group Discussion Room for Student (5-6 persons)' },
  { value: 'group-7-8', label: 'Group Discussion Room for Student (7-8 persons)' }
];

const timeSlots = [
  { value: '09:00-10:00', label: '09.00 AM - 10.00 AM' },
  { value: '10:10-11:10', label: '10.10 AM - 11.10 AM' },
  { value: '11:20-12:20', label: '11.20 AM - 12.20 PM' },
  { value: '12:30-13:30', label: '12.30 PM - 01.30 PM' },
  { value: '13:40-14:40', label: '01.40 PM - 02.40 PM' },
  { value: '14:50-15:50', label: '02.50 PM - 03.50 PM' },
  { value: '16:00-17:00', label: '04.00 PM - 5.00 PM' },
  { value: '17:10-18:10', label: '05.10 PM - 06.10 PM' },
  { value: '18:20-19:20', label: '06.20 PM - 07.20 PM' },
  { value: '19:30-20:30', label: '07.30 PM - 08.30 PM' },
  { value: '20:40-21:40', label: '08.40 PM - 09.40 PM' }
];

const getRoomOptions = (facilityType: string) => {
  switch (facilityType) {
    case 'faculty-pod':
    case 'student-pod':
      return [
        { value: 'SP-01', label: 'SP-01' },
        { value: 'SP-02', label: 'SP-02' },
        { value: 'SP-03', label: 'SP-03' },
        { value: 'SP-04', label: 'SP-04' },
        { value: 'SP-05', label: 'SP-05' }
      ];
    case 'group-3-4':
      return [
        { value: '09L-05', label: '09L-05' },
        { value: '09L-07', label: '09L-07' }
      ];
    case 'group-faculty':
      return [
        { value: '09L-01', label: '09L-01' },
        { value: '09L-02', label: '09L-02' }
      ];
    case 'group-4-5':
      return [
        { value: '08L-01', label: '08L-01' },
        { value: '08L-03', label: '08L-03' },
        { value: '08L-04', label: '08L-04' },
        { value: '08L-06', label: '08L-06' }
      ];
    case 'group-5-6':
      return [
        { value: '08L-02', label: '08L-02' },
        { value: '08L-05', label: '08L-05' }
      ];
    case 'group-7-8':
      return [
        { value: '09L-06', label: '09L-06' }
      ];
    default:
      return [];
  }
};

export default function FacilityBooking() {
  const [date, setDate] = useState<Date | null>(null);
  const [facility, setFacility] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [agreed, setAgreed] = useState(false);

  const generateReservationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const checkSlotAvailability = async (date: Date, room: string, slots: string[]) => {
    try {
      const existingBookings = await sql`
        SELECT slots
        FROM bookings
        WHERE date = ${date.toISOString().split('T')[0]}
        AND room = ${room}
      `;

      const bookedSlots = existingBookings.flatMap(booking => booking.slots);
      return !slots.some(slot => bookedSlots.includes(slot));
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !facility || !room || !email || selectedSlots.length === 0 || !agreed) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedSlots.length > 3) {
      alert('You can only select up to 3 time slots');
      return;
    }

    const reservationCode = generateReservationCode();

    try {
      const slotsAvailable = await checkSlotAvailability(
        date,
        room.value,
        selectedSlots.map(slot => slot.value)
      );

      if (!slotsAvailable) {
        alert('You chose a reserved slot. Try again with choosing available slot.');
        return;
      }

      await sql`
        INSERT INTO bookings (
          reservation_code,
          date,
          facility_type,
          room,
          email,
          slots
        ) VALUES (
          ${reservationCode},
          ${date.toISOString().split('T')[0]},
          ${facility.value},
          ${room.value},
          ${email},
          ${selectedSlots.map(slot => slot.value)}
        )
      `;

      sessionStorage.setItem('reservationDetails', JSON.stringify({
        code: reservationCode,
        facility: facility.label,
        room: room.value,
        date: date,
        slots: selectedSlots
      }));

      window.location.href = `/facility-booking/user-info?type=${facility.value}`;
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating your booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Library Facility Booking System</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                <DatePicker
                  selected={date}
                  onChange={setDate}
                  minDate={new Date()}
                  placeholderText="Choose date"
                  className="w-full p-2 border rounded text-sm md:text-base"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                <Select
                  options={facilities}
                  value={facility}
                  onChange={(option) => {
                    setFacility(option);
                    setRoom(null);
                  }}
                  placeholder="Select facility"
                  className="w-full text-sm md:text-base"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                <Select
                  options={facility ? getRoomOptions(facility.value) : []}
                  value={room}
                  onChange={setRoom}
                  placeholder="Select room"
                  className="w-full text-sm md:text-base"
                  isDisabled={!facility}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your g-suite email"
                  className="w-full p-2 border rounded text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  Choose your slots (maximum 3)
                </label>
                <Select
                  options={timeSlots}
                  value={selectedSlots}
                  onChange={setSelectedSlots}
                  isMulti
                  className="w-full text-sm md:text-base"
                  placeholder="Select time slots"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="text-sm md:text-base text-gray-600">
                  I have read and agree to the terms and conditions
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm md:text-base"
                disabled={!agreed}
              >
                Proceed
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <Image
              src="/library-booking.jpg"
              alt="Library Facility"
              width={600}
              height={800}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}