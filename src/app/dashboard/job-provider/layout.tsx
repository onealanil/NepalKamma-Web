"use client";

import React from "react";

export default function JobProviderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content Area */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}