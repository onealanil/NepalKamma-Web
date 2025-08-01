import useSWR, { mutate } from "swr";
import { fetchUserGigs } from "@/lib/gig/gig-api";

export const useUserGigs = (userId: string) => {
    const key = userId ? `/gig/getSingleUserGig/${userId}` : null;
    
    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        () => fetchUserGigs(userId),
        { revalidateOnFocus: false }
    );

    return {
        gigs: data?.userGigs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
