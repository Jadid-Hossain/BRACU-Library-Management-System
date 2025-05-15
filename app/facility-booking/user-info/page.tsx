'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import sql from '@/lib/neon-db';

interface UserInfo {
  id: string;
  department: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

export default function UserInfo() {
  const searchParams = useSearchParams();
  const [isGroup, setIsGroup] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([{
    id: '',
    department: '',
    email: '',
    mobile: '',
    firstName: '',
    lastName: ''
  }]);
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    setIsGroup(type?.includes('group') || false);
    
    // Get reservation details from session storage
    if (typeof window !== 'undefined') {
      const details = sessionStorage.getItem('reservationDetails');
      console.log('Retrieved reservation details from session storage:', details);
      if (details) {
        try {
          const parsedDetails = JSON.parse(details);
          console.log('Parsed reservation details:', parsedDetails);
          
          // Convert ISO date string back to Date object if needed
          if (parsedDetails.date && typeof parsedDetails.date === 'string') {
            parsedDetails.date = new Date(parsedDetails.date);
          }
          
          setReservationDetails(parsedDetails);
        } catch (error) {
          console.error('Error parsing reservation details:', error);
          setError('Error retrieving reservation details. Please try booking again.');
        }
      } else {
        console.warn('No reservation details found in session storage');
        setError('No reservation details found. Please start the booking process again.');
      }
    }
  }, [searchParams]);

  const validateForm = () => {
    // Check if all fields are filled
    for (const user of userInfo) {
      if (!user.id || !user.department || !user.email || !user.mobile || !user.firstName || !user.lastName) {
        setError('Please fill in all fields for all users');
        return false;
      }
    }
    
    // Check if group booking has at least 3 members
    if (isGroup && userInfo.length < 3) {
      setError('Group bookings require at least 3 members');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (!reservationDetails || !reservationDetails.code) {
      setError('Reservation details not found. Please start the booking process again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting user info with reservation code:', reservationDetails.code);
      // Save user information to database
      for (const user of userInfo) {
        await sql`
          INSERT INTO user_info (
            reservation_code,
            user_id,
            department,
            email,
            mobile,
            first_name,
            last_name
          ) VALUES (
            ${reservationDetails.code},
            ${user.id},
            ${user.department},
            ${user.email},
            ${user.mobile},
            ${user.firstName},
            ${user.lastName}
          )
        `;
      }
      
      console.log('User info saved successfully, navigating to confirmation page');
      // Navigate to confirmation page
      window.location.href = '/facility-booking/confirmation';
    } catch (error) {
      console.error('Error saving user information:', error);
      setError('An error occurred while saving your information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = () => {
    setUserInfo([...userInfo, {
      id: '',
      department: '',
      email: '',
      mobile: '',
      firstName: '',
      lastName: ''
    }]);
  };

  return (
    <div className="min-h-screen bg-sky-100 py-6 md:py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            {isGroup ? "Group Members' Details" : "Initiator's Information"}
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {userInfo.map((user, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <hr className="my-6" />}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {isGroup ? 'Student ID' : 'Faculty ID'}
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].id = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={user.department}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].department = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].email = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    value={user.mobile}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].mobile = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={user.firstName}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].firstName = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={user.lastName}
                    onChange={(e) => {
                      const newInfo = [...userInfo];
                      newInfo[index].lastName = e.target.value;
                      setUserInfo(newInfo);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>
            ))}

            {isGroup && (
              <button
                type="button"
                onClick={addMember}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm md:text-base"
              >
                + Add another member
              </button>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm md:text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}