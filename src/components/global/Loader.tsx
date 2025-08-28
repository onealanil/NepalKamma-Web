"use client"

import Image from "next/image"

export default function Loader() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <Image
                        src="/images/NepalKamma.png"
                        alt="NepalKamma"
                        width={200}
                        height={80}
                        className="mx-auto"
                        priority
                    />
                </div>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        </div>
    )
}