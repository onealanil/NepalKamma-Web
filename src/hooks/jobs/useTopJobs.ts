import useSWR from "swr";
import { fetchTopJobs } from "@/lib/job/job-api";

/**
 * @function useTopJobs
 * @param limit - Number of top jobs to fetch (default: 5)
 * @param sortBy - Sort criteria: 'price' | 'rating' | 'recent' | 'popular'
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching top jobs based on various criteria
 */
export const useTopJobs = (
    limit: number = 5, 
    sortBy: 'price' | 'rating' | 'recent' | 'popular' = 'popular'
) => {
    const key = `/job/top?limit=${limit}&sortBy=${sortBy}`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            const response = await fetchTopJobs(limit, sortBy);
            return response.success ? response.data : null;
        },
        { 
            revalidateOnFocus: false,
            refreshInterval: 900000 // Refresh every 15 minutes
        }
    );

    return {
        jobs: data?.jobs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
