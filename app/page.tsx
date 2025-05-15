'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import LibraryFacilities from '@/components/LibraryFacilities';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <LibraryFacilities />
      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </main>
  );
} 