'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="relative h-[500px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/welcome-image.png")' }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to BRAC University Library</h1>
          <p className="text-xl">Your Gateway to Knowledge and Research</p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 