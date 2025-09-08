"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-lg text-center">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/images/NepalKamma.png"
                        alt="NepalKamma Logo"
                        width={200}
                        height={80}
                        className="mx-auto object-contain"
                        priority
                    />
                </div>

                {/* Animated 404 */}
                <div className="mb-8">
                    <h1 className="text-8xl md:text-9xl font-bold text-primary opacity-20 select-none">
                        404
                    </h1>
                    <div className="relative -mt-16">
                        <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
                            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.336-5.29-3.291M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                        Oops! Page Not Found
                    </h2>

                    <p className="text-gray-600 mb-8 text-lg">
                        The page you&apos;re looking for seems to have wandered off. 
                        Let&apos;s get you back on track!
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            ← Go Back
                        </button>
                        
                        <button 
                            onClick={() => router.push('/')}
                            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            🏠 Home Page
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-sm text-gray-500 mt-6">
                    Error Code: 404 | Page Not Found
                </p>
            </div>
        </div>
    );
}