import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import SWRProvider from '@/components/providers/SWRProvider';
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NepalKamma - Connecting Talent with Opportunities Locally",
  description: "Nepal's first local gig marketplace connecting skilled neighbors with quick jobs and linking talented professionals with those who need them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader
          color="#32b327" 
          height={6} 
          showSpinner={false} 
          easing="ease-in-out" 
          shadow="0 0 10px #FF0000,0 0 5px #FF0000" 
        />
        <SWRProvider>
          {children}
          <ToastContainer />
        </SWRProvider>
      </body>
    </html>
  );
}