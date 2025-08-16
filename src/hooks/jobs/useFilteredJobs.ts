import useSWR from "swr";
import { searchJobs } from "@/lib/job/job-api";
import { JobFilters } from "@/types/filters";
import { useAuthStore } from "@/store/authStore";

/**
 * @function useSearchJobs
 * @param page - Page number (default: 1)
 * @param limit - Number of jobs per page (default: 5)
 * @param filters - Filter parameters matching backend structure
 * @returns: {jobs: JobI[], isLoading: boolean, isError: boolean, mutate: () => void, totalPages: number, totalJobs: number, currentPage: number}
 * @description: This hook is for searching jobs with filters and pagination
 */
export const useSearchJobs = (
    page: number = 1,
    limit: number = 5,
    filters: JobFilters = {}
) => {
    const { user } = useAuthStore();

    // Get user location from auth store
    const userLat = user?.address?.coordinates?.[1] || null; // latitude
    const userLng = user?.address?.coordinates?.[0] || null; // longitude

    // Create a stable key for SWR that includes all search parameters
    const createKey = () => {
        const baseKey = `/job/searchjob?page=${page}&limit=${limit}`;
        const filterParams = new URLSearchParams();

        if (filters.text && filters.text.trim()) {
            filterParams.append('text', filters.text.trim());
        }

        if (filters.category && filters.category !== 'All' && filters.category !== 'all') {
            filterParams.append('category', filters.category);
        }

        if (filters.distance !== undefined && filters.distance > 0) {
            filterParams.append('distance', filters.distance.toString());
        }

        if (filters.sortBy) {
            filterParams.append('sortBy', filters.sortBy);
        }

        // Include distance filter toggle in cache key
        filterParams.append('useDistanceFilter', (filters.useDistanceFilter || false).toString());

        // Use user location from auth store only if distance filter is enabled
        if (filters.useDistanceFilter && userLat !== null && userLng !== null) {
            filterParams.append('lat', userLat.toString());
            filterParams.append('lng', userLng.toString());
        }

        const filterString = filterParams.toString();
        return filterString ? `${baseKey}&${filterString}` : baseKey;
    };

    const key = createKey();

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            // Convert sortBy to backend format
            let sortByRating = false;
            let sortByPriceHighToLow = false;
            let sortByPriceLowToHigh = false;

            switch (filters.sortBy) {
                case 'rating':
                    sortByRating = true;
                    break;
                case 'price_high_to_low':
                    sortByPriceHighToLow = true;
                    break;
                case 'price_low_to_high':
                    sortByPriceLowToHigh = true;
                    break;
                default:
                    // 'recent' or undefined - no sorting flags needed (backend default)
                    break;
            }

            // Only use location and distance if distance filter is enabled and user has location
            const shouldUseLocation = filters.useDistanceFilter && userLat !== null && userLng !== null;

            // Call API with your existing pattern
            const response = await searchJobs(
                filters.text || '',
                filters.category || '',
                shouldUseLocation ? (filters.distance || null) : null,
                sortByPriceLowToHigh,
                sortByPriceHighToLow,
                sortByRating,
                page,
                limit,
                shouldUseLocation ? userLat : null,
                shouldUseLocation ? userLng : null
            );

            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true, // Keep previous data while loading new page
            dedupingInterval: 5000, // Dedupe requests within 5 seconds
        }
    );

    return {
        jobs: data?.job || [],
        totalPages: data?.totalPages || 0,
        totalJobs: data?.totalJobs || 0,
        currentPage: data?.currentPage || page,
        isLoading,
        isError: !!error,
        mutate: revalidate,
        // Additional metadata that might be useful
        appliedFilters: filters,
        hasActiveFilters: !!(
            filters.text ||
            (filters.category && filters.category !== 'All' && filters.category !== 'all') ||
            (filters.distance && filters.distance !== 5) ||
            (filters.sortBy && filters.sortBy !== 'recent') ||
            (filters.useDistanceFilter === false) // Show as active when distance filter is disabled
        ),
    };
};
