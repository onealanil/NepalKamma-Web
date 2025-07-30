import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useAuthStore } from "@/store/authStore";

/**
 * @function useAuth
 * @returns {userData: User | null, isLoading: boolean, isError: boolean}
 * @description This hook is used to fetch the user data. It returns the user data, loading state, and error state.
 */
export const useAuth = () => {
    const { setUser } = useAuthStore();

    const { data, error, isLoading } = useSWR("/auth/check-auth", fetcher, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            setUser(data.user);
        }
    })

    return {
        userData: data?.user,
        isLoading,
        isError: !!error,
    }
}