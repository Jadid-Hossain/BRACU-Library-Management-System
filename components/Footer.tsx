"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[var(--primary-color)] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Library Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">AYESHA ABED LIBRARY</h3>
            <p className="text-sm">
              8th and 9th floor, A Block, BRACU
              <br />
              kha-208, 1 Bir Uttam Rafiqul Islam Ave,
              <br />
              Dhaka 1212
            </p>
          </div>

          {/* Library Timings */}
          <div>
            <h3 className="text-lg font-bold mb-4">LIBRARY TIMINGS</h3>
            <ul className="text-sm space-y-2">
              <li>Sunday - Thursday: 9:00 am - 10:00 pm</li>
              <li>Friday: 2:30 pm - 9:00 pm</li>
              <li>Saturday: 1:00 pm - 9:00 pm</li>
            </ul>
          </div>

          {/* Services & Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">SERVICES</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/facility-booking/details">Facility Booking</Link>
              </li>
              <li>
                <Link href="/membership">Library Membership Activation</Link>
              </li>
              <li>
                <Link href="/similarity-check">Similarity Check</Link>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">STAY CONNECTED</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/braculibrary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.youtube.com/@ayeshaabedlibrarybracunive293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
