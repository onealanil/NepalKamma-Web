'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAuthInit } from "@/hooks/useAuthInit";
import Loader from "@/components/global/Loader";
import { useSavedJobsStore } from "@/store/savedJobsStore";

/**
 * @function AuthLayout
 * @param children The children of the layout.
 * @returns The layout for the authentication pages.
 * @description This layout is used for the authentication pages. It checks if the user is already logged in and redirects them to the dashboard if they are.
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, hasHydrated } = useAuthStore();
    const { isInitialized } = useAuthInit(true);
    const {fetchSavedJobs} = useSavedJobsStore();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!hasHydrated || !isInitialized) return;

        if (user) {
            setIsRedirecting(true);
            fetchSavedJobs();
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
        return <Loader/>;
    }

    return <>{children}</>;
}
