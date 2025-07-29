'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { logOut } from '@/lib/auth';

export default function Header() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

   const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      logout();
      router.push('/auth/signin');
      
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/images/NepalKamma.png"
              alt="NepalKamma Logo"
              width={250}
              height={100}
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <Link href="/dashboard/job-seeker" className="text-black hover:text-gray-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/job-seeker/explore" className="text-black hover:text-gray-500 transition-colors">
              Explore
            </Link>
            <Link href="/dashboard/job-seeker/chat" className="text-black hover:text-gray-500 transition-colors">
              Message
            </Link>
            <Link href="/dashboard/job-seeker/top-buyer" className="text-black hover:text-gray-500 transition-colors">
              Top Buyer
            </Link>
            <Link href="/dashboard/job-seeker/profile" className="text-black hover:text-gray-500 transition-colors">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-primary text-white hover:bg-primary-foreground transition-colors px-4 py-2 rounded-md"
            >
              Log out
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-black hover:text-gray-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg z-50 md:hidden transform transition-transform duration-300">
            <div className="p-6">
              {/* Close button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="space-y-6">
                <Link 
                  href="/dashboard/job-seeker" 
                  className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/job-seeker/explore" 
                  className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Explore
                </Link>
                <Link 
                  href="/dashboard/job-seeker/chat" 
                  className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Message
                </Link>
                <Link 
                  href="/dashboard/job-seeker/top-buyer" 
                  className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Top Buyer
                </Link>
                <Link 
                  href="/dashboard/job-seeker/profile" 
                  className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-primary text-white hover:bg-primary-foreground transition-colors px-4 py-3 rounded-md font-medium text-lg mt-8"
                >
                  Log out
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
