import useSWR from "swr";
import { fetchCompletedJobsProvider } from "@/lib/job/job-api";

/**
 * @function useCompletedJobsProvider
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching completed jobs for the job provider
 */
export const useCompletedJobsProvider = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/job/completedJobs',
        async () => {
            const response = await fetchCompletedJobsProvider();
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
