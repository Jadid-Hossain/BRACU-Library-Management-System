'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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

  useEffect(() => {
    const type = searchParams.get('type');
    setIsGroup(type?.includes('group') || false);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/facility-booking/confirmation';
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
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}