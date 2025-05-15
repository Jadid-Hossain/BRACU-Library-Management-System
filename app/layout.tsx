import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import localFont from "next/font/local";
import { Inter } from 'next/font/google';
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InitSystem from './components/InitSystem';

const inter = Inter({ subsets: ['latin'] });

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "BRAC University Library",
  description: "Welcome to the Ayesha Abed Library, where you can find the library facility of BRACU.",
  icons: {
    icon: [
      { url: '/uni_logo.png', type: 'image/png' }
    ],
    apple: [
      { url: '/uni_logo.png' }
    ]
  }
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${inter.className} ${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
          <InitSystem />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;