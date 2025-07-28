import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useAuthStore } from "@/store/authStore";

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
        isError: !!error
    }
}