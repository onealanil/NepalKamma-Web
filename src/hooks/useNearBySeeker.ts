import useSWR from "swr";
import { fetchNearbySeekers } from "@/lib/profile/user-api";
import { User } from "@/types/user";
import { JobSeekerPaginationInfo } from "@/components/top-rated-seller/TopRatedJobSeekerPagination";


/**
 * @function useNearBySeekers
 * @param page - The page number to fetch (default: 1)
 * @returns: {users: UserI[], pagination: JobSeekerPaginationInfo, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching nearby job seekers with pagination
 */
export const useNearBySeekers = (page: number = 1, latitude?: number, longitude?: number) => {
    const key = latitude && longitude ? `/user/getNearbyJobSeeker/${latitude}/${longitude}?page=${page}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async (): Promise<{ data: User[]; pagination: JobSeekerPaginationInfo } | null> => {
            const response = await fetchNearbySeekers(page, latitude || undefined, longitude || undefined);
            return response.success ? (response.data as { data: User[]; pagination: JobSeekerPaginationInfo }) : null;
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true
        }
    );

    const jobSeekers: User[] = data?.data || [];
    const pagination: JobSeekerPaginationInfo = data?.pagination || {
        currentPage: page,
        totalPages: 1,
        totalJobSeekers: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    };

    return {
        users: jobSeekers,
        pagination,
        isLoading,
        isError: !!error || (data && !data),
        mutate: revalidate,
    };
};