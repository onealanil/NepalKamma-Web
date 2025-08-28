import useSWR from "swr";
import { fetchSingleUserProvider } from "@/lib/profile/user-api";

/**
 * @function useSingleUserProvider
 * @param userId - User ID to fetch
 * @returns: {user: User | null, userJobs: Job[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching a single user provider and their jobs
 */
export const useSingleUserProvider = (userId?: string) => {
    const key = userId ? `/user/provider/${userId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!userId) return null;
            const response = await fetchSingleUserProvider(userId);
            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0, // Don't auto-refresh user profile
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                // Don't retry on 404 (user not found)
                if (error.status === 404) return;
                
                // Don't retry after 3 attempts
                if (retryCount >= 3) return;
                
                // Retry after 5 seconds
                setTimeout(() => revalidate({ retryCount }), 5000);
            }
        }
    );

    return {
        user: data?.user || null,
        userJobs: data?.userJobs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
