import useSWR, {mutate} from "swr";
import { fetchUserJobs } from "@/lib/job/job-api";

export const useUserJobs = (userId?: string) => {
    const key = userId ? `/job/getSingleUserJob/${userId}` : null;
    
    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        () => fetchUserJobs(userId as string),
        { revalidateOnFocus: false }
    );


    return {
        jobs: data?.userJobs || [],
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
