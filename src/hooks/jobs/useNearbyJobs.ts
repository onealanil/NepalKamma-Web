import useSWR from "swr";
import { fetchNearbyJobs } from "@/lib/job/job-api";
import { useEffect } from "react";

/**
 * @function useNearbyJobs
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @param radius - Search radius in kilometers (default: 10)
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching nearby jobs based on user location
 */
export const useNearbyJobs = (
    latitude?: number, 
    longitude?: number, 
) => {
    const key = latitude && longitude 
        ? `/job/getNearbyJob/${latitude}/${longitude}` 
        : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        async () => {
            if (!latitude || !longitude) return null;
            const response = await fetchNearbyJobs(latitude, longitude);
            return response.success ? response.data : [];
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
        jobs: data || [],
        isLoading,
        isError: !!error,
        mutate
    };
};
