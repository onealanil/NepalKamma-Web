import { useAuthStore } from '@/store/authStore';
import { useAuthInit } from './useAuthInit';

/**
 * @function useEnsureAuth
 * @returns {isReady: boolean, isLoading: boolean, user: User | null, accessToken: string | null}
 * @description This hook is used to ensure that the user is authenticated. It returns the user and access token if the user is authenticated.
 */
export const useEnsureAuth = () => {
  const { user, accessToken, hasHydrated } = useAuthStore();
  const { isInitialized } = useAuthInit();

  const isReady = hasHydrated && isInitialized && user && accessToken;

  return {
    isReady,
    isLoading: !hasHydrated || !isInitialized,
    user,
    accessToken
  };
};