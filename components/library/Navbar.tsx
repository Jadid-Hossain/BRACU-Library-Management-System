'use client';

import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const aboutItems = [
    { label: 'Ayesha Abed Library', href: '/about' },
    { label: 'Library User Policy', href: '/about/library-user-policy' },
    { label: 'Access Policy for External Users', href: '/about/access-policy' },
  ];

  const serviceItems = [
    { label: 'Library Membership Activation', href: '/membership' },
    { label: 'Borrowing Privileges', href: '/borrowing' },
    { label: 'Information Literacy & Classes', href: '/information-literacy' },
    { label: 'Thesis-Internship Report Submission', href: '/research-help' },
    { label: 'Facility Booking', href: '/facility-booking' },
  ];

  return (
    <nav className="bg-[var(--primary-color)] text-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="BRAC University Library"
                width={150}
                height={40}
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-1 hover:text-gray-300 font-bold">
                  <span>About</span>
                  <ChevronDown className="h-4 w-4" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 text-black">
                  {aboutItems.map((item) => (
                    <Menu.Item key={item.label}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>

              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-1 hover:text-gray-300 font-bold">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 text-black">
                  {serviceItems.map((item) => (
                    <Menu.Item key={item.label}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>

              <Link href="/downloads" className="hover:text-gray-300 font-bold">
                Downloads
              </Link>
              <Link href="/contact" className="hover:text-gray-300 font-bold">
                Contacts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;