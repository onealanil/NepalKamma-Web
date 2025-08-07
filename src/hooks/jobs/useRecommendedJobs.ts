import useSWR from "swr";
import { fetchRecommendedJobs } from "@/lib/job/job-api";

/**
 * @function useRecommendedJobs
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching recommended jobs based on user profile
 */
export const useRecommendedJobs = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/job/getRecommendedJob',
        async () => {
            const response = await fetchRecommendedJobs();
            return response.success ? response.data : [];
        },
        { 
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        jobs: data || [],
        isLoading,
        isError: !!error,
        mutate
    };
};
