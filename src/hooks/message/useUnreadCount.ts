import useSWR from "swr";
import { getUnreadMessageCount } from "@/lib/message/message-api";
import { UnreadCountResponse } from "@/types/message";

/**
 * @function useUnreadCount
 * @returns: {unreadCount: number, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching unread message count for the current user
 */
export const useUnreadCount = () => {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    '/message/unreadMessage',
    async (): Promise<UnreadCountResponse | null> => {
      const response = await getUnreadMessageCount();
      return response.success ? (response.data as UnreadCountResponse) : null;
    },
    {
      revalidateOnFocus: true,
      refreshInterval: 10000, // Refresh every 10 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  return {
    unreadCount: data?.result || 0,
    isLoading,
    isError: !!error,
    mutate: revalidate,
  };
};
