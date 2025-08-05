import Footer from '@/components/layout/Footer';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import SWRProvider from '@/components/providers/SWRProvider';

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

/**
 * @function RootLayout
 * @param param0 
 * @returns The main layout of the application.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SWRProvider>
          {children}
          {/* <Footer/> */}
          <ToastContainer />
        </SWRProvider>
      </body>
    </html>
  );
}
