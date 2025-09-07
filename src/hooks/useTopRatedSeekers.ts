import useSWR from "swr";
import { fetchTopRatedSeeker } from "@/lib/profile/user-api";
import { User } from "@/types/user";
import { JobSeekerPaginationInfo } from "@/components/top-rated-seller/TopRatedJobSeekerPagination";


/**
 * @function useTopRatedSeeker
 * @param page - The page number to fetch (default: 1)
 * @returns: {users: UserI[], pagination: JobSeekerPaginationInfo, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching top rated job seekers with pagination
 */
export const useTopRatedSeeker = (page: number = 1) => {
    const key = `/user/top-rated-job-seeker?page=${page}`;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async (): Promise<{ data: User[]; pagination: JobSeekerPaginationInfo } | null> => {
            const response = await fetchTopRatedSeeker(page);
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