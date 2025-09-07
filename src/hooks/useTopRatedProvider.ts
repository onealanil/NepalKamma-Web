import useSWR from "swr";
import { fetchTopRatedProvider } from "@/lib/profile/user-api";
import { User } from "@/types/user";
import { JobProviderPaginationInfo } from "@/components/near-by-provider/NearByProviderPagination";


/**
 * @function useTopRatedProvider
 * @param page - The page number to fetch (default: 1)
 * @returns: {users: UserI[], pagination: JobProviderPaginationInfo, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching top rated job providers with pagination
 */
export const useTopRatedProvider = (page: number = 1) => {
    const key = `/user/top-rated-job-provider?page=${page}`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async (): Promise<{ data: User[]; pagination: JobProviderPaginationInfo } | null> => {
            const response = await fetchTopRatedProvider(page);
            return response.success ? (response.data as { data: User[]; pagination: JobProviderPaginationInfo }) : null;
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true
        } 
    );

    const jobProviders: User[] = data?.data || [];
    const pagination: JobProviderPaginationInfo = data?.pagination || {
        currentPage: page,
        totalPages: 1,
        totalJobProviders: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    };

    return {
        users: jobProviders,
        pagination,
        isLoading,
        isError: !!error || (data && !data),
        mutate: revalidate,
    };
};