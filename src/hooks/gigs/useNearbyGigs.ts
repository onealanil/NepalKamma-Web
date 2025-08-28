import useSWR from "swr";
import { fetchNearbyGigs } from "@/lib/gig/gig-api";
import { useEffect } from "react";
import { GigI } from "@/types/gig";

/**
 * @function useNearbyGigs
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns: {gigs: GigI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching nearby gigs based on user location
 */
export const useNearbyGigs = (latitude?: number, longitude?: number) => {
    const key = latitude && longitude ? `/gig/getNearbyGig/${latitude}/${longitude}` : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        async () => {
            if (!latitude || !longitude) return null;
            const response = await fetchNearbyGigs(latitude, longitude);
            return response.success ? (response.data as GigI[]) : [];
        },
        { 
            revalidateOnFocus: true,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );  

    useEffect(() => {
        if (latitude && longitude) {
            mutate(); 
        }
    }, [latitude, longitude, mutate]);

    return {
        gigs: data || [],
        isLoading,
        isError: !!error,
        mutate
    };
};
