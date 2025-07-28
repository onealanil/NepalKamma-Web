'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAuthInit } from "@/hooks/useAuthInit";
import Loader from "@/components/global/Loader";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, hasHydrated } = useAuthStore();
    const { isInitialized } = useAuthInit(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!hasHydrated || !isInitialized) return;

        if (user) {
            setIsRedirecting(true);
            if (user.role === 'job_seeker') {
                router.push('/dashboard/job-seeker');
            } else if (user.role === 'job_provider') {
                router.push('/dashboard/job-provider');
            }
        }
    }, [user, hasHydrated, isInitialized, router]);

    if (!hasHydrated || !isInitialized || isRedirecting) {
        return <Loader/>
    }

    if (user) {
        return <Loader/>; // Show loader while redirecting
    }

    return <>{children}</>;
}
