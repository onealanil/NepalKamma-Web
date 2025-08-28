import useSWR from "swr";
import { fetchAllGigs } from "@/lib/gig/gig-api";
import { PaginatedGigs } from "@/types/gig";

/**
 * @function useAllGigs
 * @param page - Page number (default: 1)
 * @param limit - Number of gigs per page (default: 10)
 * @returns: {gigs: GigI[], isLoading: boolean, isError: boolean, mutate: () => void, totalGigs: number, totalPages: number, currentPage: number}
 * @description: Hook for fetching paginated gigs
 */
export const useAllGigs = (page: number = 1, limit: number = 10) => {
    const { data, error, isLoading, mutate } = useSWR(
        `/gig?page=${page}&limit=${limit}`,
        async () => {
            const response = await fetchAllGigs(page, limit);
            return response.success ? (response.data as PaginatedGigs) : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        gigs: data?.gig || [],
        totalGigs: data?.totalGigs || 0,
        totalPages: data?.totalPages || 0,
        currentPage: data?.currentPage || page,
        isLoading,
        isError: !!error,
        mutate
    };
};
