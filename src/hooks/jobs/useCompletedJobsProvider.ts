import useSWR from "swr";
import { fetchCompletedJobsProvider } from "@/lib/job/job-api";
import { JobI } from "@/types/job";

/**
 * @function useCompletedJobsProvider
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching completed jobs for the job provider
 */
export const useCompletedJobsProvider = () => {
    const { data, error, isLoading, mutate } = useSWR<JobI[]>(
        '/job/completedJobs',
        async (): Promise<JobI[]> => {
            const response = await fetchCompletedJobsProvider();
            return response.success ? (response.data as JobI[]) : [];
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