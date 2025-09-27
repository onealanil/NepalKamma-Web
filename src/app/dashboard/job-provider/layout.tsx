'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/global/Loader";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";

export default function JobProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, hasHydrated, setUser } = useAuthStore();
    const { userData, isLoading } = useAuth();

    useEffect(() => {
        if (!hasHydrated) return;

        if (!user) {
            router.push('/auth/signin');
        } else if (user.role === 'admin') {
            // Admin users should not access job-provider dashboard  
            useAuthStore.getState().logout();
            router.push('/auth/signin');
        } else if (user.role !== 'job_provider') {
            router.push('/unauthorized');
        } else if (userData) {
            setUser(userData);
        }
    }, [user, hasHydrated, userData, router, setUser]);


    // Show loader until everything is ready
    if (!hasHydrated || isLoading || !user || (user && !userData)) {
        return (
            <Loader />
        );
    }

    return (
        <div className="min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content Area */}
            <div className="flex-1">
                <Header />
                {children}
            </div>
        </div>
    );
}
