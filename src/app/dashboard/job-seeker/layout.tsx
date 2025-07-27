
'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const { user, hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!hasHydrated) return;

        if (!user) {
            router.push('/auth/signin');
        } else if (user.role !== 'job_seeker') {
            router.push('/unauthorized');
        }
    }, [user, hasHydrated, router]);

    // Show loader if not hydrated OR if no user (prevents flash of content)
    if (!hasHydrated || !user) {
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
        );
    }

    return (
        <div className="min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content Area */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

