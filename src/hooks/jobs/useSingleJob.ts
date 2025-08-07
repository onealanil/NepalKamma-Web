
import useSWR from "swr";
import { fetchJobById } from "@/lib/job/job-api";

/**
 * @function useSingleJob
 * @param jobId - Job ID to fetch
 * @returns: {job: JobI | null, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching a single job by ID
 */
export const useSingleJob = (jobId?: string) => {
    const key = jobId ? `/job/${jobId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!jobId) return null;
            const response = await fetchJobById(jobId);
            return response.success ? response.data : null;
        },
        { 
            revalidateOnFocus: false,
            refreshInterval: 0, // Don't auto-refresh job details
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        job: data?.job || null,
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
