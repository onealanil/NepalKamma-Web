import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import axios from 'axios';

/**
 * @function useAuthInit
 * @param skipAuthCheck {boolean} - if true, it will skip the auth check
 * @returns {isInitialized: boolean}
 * @description This hook is used to initialize the auth state. It checks if the user is logged in and refreshes the token if necessary.
 */
export const useAuthInit = (skipAuthCheck = false) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { hasHydrated, setUser, setAccessToken, user } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasHydrated) return;
      
      if (skipAuthCheck) {
        setIsInitialized(true);
        return;
      }

      // If user exists but no access token, refresh immediately
      if (user && !useAuthStore.getState().accessToken) {
        try {
          // Use regular axios to avoid circular dependency
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
          
          const { accessToken } = data;
          setAccessToken(accessToken);
          
          // Verify the token works
          const userResponse = await axiosInstance.get('/auth/check-auth');
          setUser(userResponse.data.user);
          
        } catch (error) {
          console.log('Token refresh failed during init');
          useAuthStore.getState().logout();
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, [hasHydrated, setUser, setAccessToken, skipAuthCheck, user]);

  return { isInitialized };
};
