
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import SWRProvider from '@/components/providers/SWRProvider';
import { SocketProvider } from '@/contexts/SocketContext';
import NextTopLoader from 'nextjs-toploader';
// import { useEffect } from "react";

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
  //   useEffect(() => {
  //   const handler = (event: PromiseRejectionEvent) => {
  //     console.error("Unhandled promise rejection:", event.reason);
  //   };

  //   window.addEventListener("unhandledrejection", handler);
  //   return () => window.removeEventListener("unhandledrejection", handler);
  // }, []);

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
          <SocketProvider>
            {children}
            <ToastContainer />
          </SocketProvider>
        </SWRProvider>
      </body>
    </html>
  );
}