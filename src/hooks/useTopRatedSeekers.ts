import useSWR from "swr";
import { fetchTopRatedSeeker } from "@/lib/profile/user-api";

/**
 * @function useTopRatedSeeker
 * @returns: {users: UserI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching top rated job providers
 */
export const useTopRatedSeeker = () => {
    const key = `/user/top-rated-job-seeker`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            const response = await fetchTopRatedSeeker();
            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true // Keep previous data while loading new page
        }
    );

    return {
        users: data || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
