import useSWR from "swr";
import { fetchGigById } from "@/lib/gig/gig-api";
import { GigI } from "@/types/gig";

/**
 * @function useSingleGig
 * @param gigId - Gig ID to fetch
 * @returns: {gig: GigI | null, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching a single gig by ID
 */
export const useSingleGig = (gigId?: string) => {
    const key = gigId ? `/gig/${gigId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!gigId) return null;
            const response = await fetchGigById(gigId);
            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0, // Don't auto-refresh gig details
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        gig: (data as { gig?: GigI })?.gig || null,
            isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
