"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Unauthorized() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
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

                {/* Error Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-black mb-4">
                    Access Denied
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8 text-lg">
                    You don't have permission to access this page. Please log in with the appropriate credentials.
                </p>

                {/* Login Button */}
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-primary text-white py-3 px-6 rounded-md font-bold text-lg hover:bg-primary/90 transition-colors"
                >
                    Go to Home Page
                </button>

                {/* Additional Help */}
                <p className="text-sm text-gray-500 mt-6">
                    Need help? Contact our support team
                </p>
            </div>
        </div>
    );
}
