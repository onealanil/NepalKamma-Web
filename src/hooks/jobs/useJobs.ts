import useSWR from "swr";
import { fetchUserJobs } from "@/lib/job/job-api";
import { UserJobs } from "@/types/job";

/**
 * @function useUserJobs
 * @param userId : User Id who posted the job
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: This hook is for the job-provider, who posted the job
 */
export const useUserJobs = (userId?: string) => {
    const key = userId ? `/job/getSingleUserJob/${userId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!userId) return null;
            const response = await fetchUserJobs(userId);
            return response.success ? (response.data as UserJobs) : null;
        },
        { revalidateOnFocus: false }
    );

    return {
        jobs: data?.userJobs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
