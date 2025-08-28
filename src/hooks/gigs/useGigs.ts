import useSWR from "swr";
import { fetchUserGigs } from "@/lib/gig/gig-api";

export const useUserGigs = (userId?: string) => {
    const key = userId ? `/gig/getSingleUserGig/${userId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        () => userId ? fetchUserGigs(userId) : null,
        {
            revalidateOnFocus: false,
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return;


                if (retryCount >= 3) return;

                setTimeout(() => revalidate({ retryCount }), 5000);
            }
        }
    );

    return {
        gigs: data?.userGigs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
