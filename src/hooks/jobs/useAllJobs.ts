import useSWR from "swr";
import { fetchAllJobs } from "@/lib/job/job-api";

/**
 * @function useAllJobs
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: This hook is for the job-provider, who posted the job
 */
export const useAllJobs = () => {
    const key = `/job`

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            const response = await fetchAllJobs();
            return response.success ? response.data : null;
        },
        { revalidateOnFocus: false }
    );

    return {
        jobs: data || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
