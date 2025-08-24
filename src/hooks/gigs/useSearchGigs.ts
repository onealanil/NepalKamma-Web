import useSWR from "swr";
import { searchGigs, type GigSearchParams } from "@/lib/gig/gig-api";
import { useMemo } from "react";
import { PaginatedGigs } from "@/types/gig";

export type { GigSearchParams };

/**
 * @function useSearchGigs
 * @param searchParams - Search parameters
 * @returns: {gigs: GigI[], isLoading: boolean, isError: boolean, mutate: () => void, totalGigs: number, totalPages: number, currentPage: number}
 * @description: Hook for searching gigs with various filters
 */
export const useSearchGigs = (searchParams: GigSearchParams) => {
    // Create a stable key for SWR based on search parameters
    const searchKey = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
        return params.toString() ? `/gig/searchgig?${params.toString()}` : null;
    }, [searchParams]);

    const { data, error, isLoading, mutate } = useSWR(
        searchKey,
        async () => {
            if (!searchKey) return null;
            const response = await searchGigs(searchParams);
            return response.success ? (response.data as PaginatedGigs) : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            revalidateIfStale: !!searchKey
        }
    );

    return {
        gigs: data?.gig || [],
        totalGigs: data?.totalGigs || 0,
        totalPages: data?.totalPages || 0,
        currentPage: data?.currentPage || searchParams.page || 1,
        isLoading,
        isError: !!error,
        mutate
    };
};
