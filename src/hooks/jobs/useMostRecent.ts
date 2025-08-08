import useSWR from "swr";
import { fetchRecentJobs } from "@/lib/job/job-api";

/**
 * @function useMostRecent
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching recent jobs posted by the job provider.
 */
export const useMostRecent = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/job/getRecentJob',
        async () => {
            const response = await fetchRecentJobs();
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
