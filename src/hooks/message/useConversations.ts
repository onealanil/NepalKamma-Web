import useSWR from "swr";
import { getConversations } from "@/lib/message/message-api";
import { ConversationsResponse } from "@/types/message";

/**
 * @function useConversations
 * @returns: {conversations: ConversationI[], isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching all conversations for the current user
 */
export const useConversations = () => {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    '/message/getConversation',
    async (): Promise<ConversationsResponse | null> => {
      const response = await getConversations();
      return response.success ? (response.data as ConversationsResponse) : null;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh every 30 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  return {
    conversations: data?.result || [],
    isLoading,
    isError: !!error,
    mutate: revalidate,
  };
};
