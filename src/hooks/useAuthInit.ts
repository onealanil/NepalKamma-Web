import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';

export const useAuthInit = (skipAuthCheck = false) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { hasHydrated, setUser, setAccessToken } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasHydrated) return;

      // If skipAuthCheck is true, just mark as initialized
      if (skipAuthCheck) {
        setIsInitialized(true);
        return;
      }

      try {
        const { data } = await axiosInstance.post('/auth/refresh-token');
        const { accessToken } = data;
        
        setAccessToken(accessToken);
        
        const userResponse = await axiosInstance.get('/auth/check-auth');
        setUser(userResponse.data.user);
        
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [hasHydrated, setUser, setAccessToken, skipAuthCheck]);

  return { isInitialized };
};
