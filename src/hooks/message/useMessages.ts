import useSWR from "swr";
import { getMessages } from "@/lib/message/message-api";
import { MessagesResponse } from "@/types/message";

/**
 * @function useMessages
 * @param conversationId - ID of the conversation to fetch messages for
 * @returns: {messages: MessageI[], otherUser: User | null, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching messages for a specific conversation
 */
export const useMessages = (conversationId?: string) => {
  const key = conversationId ? `/message/messagesCombo/${conversationId}` : null;

  const { data, error, isLoading, mutate: revalidate } = useSWR(
    key,
    async (): Promise<MessagesResponse | null> => {
      if (!conversationId) return null;
      const response = await getMessages(conversationId);
      return response.success ? (response.data as MessagesResponse) : null;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 5000, // Refresh every 5 seconds for real-time feel
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  return {
    messages: data?.result || [],
    otherUser: data?.otheruser || null,
    isLoading,
    isError: !!error,
    mutate: revalidate,
  };
};
