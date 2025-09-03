import useSWR from "swr";
import { fetchNearbyProviders } from "@/lib/profile/user-api";
import { User } from "@/types/user";
import { JobProviderPaginationInfo } from "@/components/near-by-provider/NearByProviderPagination";


/**
 * @function useNearbyProviders
 * @param page - The page number to fetch (default: 1)
 * @returns: {users: UserI[], pagination: JobSeekerPaginationInfo, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching nearby job providers with pagination
 */
export const useNearbyProviders = (page: number = 1, latitude?: number, longitude?: number) => {
    const key = latitude && longitude ? `/user/getNearbyJobProvider/${latitude}/${longitude}?page=${page}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async (): Promise<{ data: User[]; pagination: JobProviderPaginationInfo } | null> => {
            const response = await fetchNearbyProviders(page, latitude || undefined, longitude || undefined);
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