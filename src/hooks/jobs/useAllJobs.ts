import useSWR from "swr";
import { fetchAllJobs } from "@/lib/job/job-api";

/**
 * @function useAllJobs
 * @param page - Page number (default: 1)
 * @param limit - Number of jobs per page (default: 5)
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void, totalPages: number, totalJobs: number, currentPage: number}
 * @description: This hook is for fetching paginated jobs
 */
export const useAllJobs = (page: number = 1, limit: number = 5) => {
    const key = `/job?page=${page}&limit=${limit}`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            const response = await fetchAllJobs(page, limit);
            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true // Keep previous data while loading new page
        }
    );

    return {
        jobs: data?.job || [],
        totalPages: data?.totalPages || 0,
        totalJobs: data?.totalJobs || 0,
        currentPage: data?.currentPage || page,
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
