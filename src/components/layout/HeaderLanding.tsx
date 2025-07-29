'use client'

import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function HeaderLanding() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        <LanguageSwitcher />
                        <Link href="#features" className="text-black hover:text-gray-500 transition-colors">
                            Features
                        </Link>
                        <Link href="#testimonials" className="text-black hover:text-gray-500 transition-colors">
                            Testimonials
                        </Link>
                        <Link href="/auth/signin" className="text-black hover:text-gray-500 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/auth/signup" className="bg-primary text-white hover:bg-primary-foreground transition-colors px-4 py-2 rounded-md">
                            Sign Up
                        </Link>
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={closeMobileMenu}
                    />
                    
                    {/* Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300">
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
                            
                            {/* Language Switcher */}
                            <div className="mb-8">
                                <LanguageSwitcher />
                            </div>
                            
                            {/* Navigation Links */}
                            <nav className="space-y-6">
                                <Link 
                                    href="#features" 
                                    className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Features
                                </Link>
                                <Link 
                                    href="#testimonials" 
                                    className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Testimonials
                                </Link>
                                <Link 
                                    href="/auth/signin" 
                                    className="block text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                
                                {/* Sign Up Button */}
                                <Link
                                    href="/auth/signup"
                                    onClick={closeMobileMenu}
                                    className="block w-full bg-primary text-white hover:bg-primary-foreground transition-colors px-4 py-3 rounded-md font-medium text-lg text-center mt-8"
                                >
                                    Sign Up
                                </Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
