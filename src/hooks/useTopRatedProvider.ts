import useSWR from "swr";
import { fetchTopRatedProvider } from "@/lib/profile/user-api";

/**
 * @function useTopRatedProvider
 * @returns: {users: UserI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching top rated job providers
 */
export const useTopRatedProvider = () => {
    const key = `/user/top-rated-job-provider`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            const response = await fetchTopRatedProvider();
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
