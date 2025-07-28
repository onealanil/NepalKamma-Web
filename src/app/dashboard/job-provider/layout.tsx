'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/global/Loader";

export default function JobProviderLayout({
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
        } else if (user.role !== 'job_provider') {
            router.push('/unauthorized');
        }
    }, [user, hasHydrated, router]);

    if (!hasHydrated || !user || user.role !== 'job_provider') {
        return (
          <Loader/>
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
