import { getPaymentByProvider } from "@/lib/payment/payment-api";
import useSWR from "swr";


/**
 * @function useGetPaymentSeeker
 * @returns: {jobs: PaymentI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching payment for the job seeker
 */
export const useGetPaymentSeeker = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/payment/getPaymentByProvider',
        async () => {
            const response = await getPaymentByProvider();
            console.log("this is response from useGetpaymentseeker", response);
            return response.success ? response.data : [];
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        jobs: data || [],
        isLoading,
        isError: !!error,
        mutate
    };
};
