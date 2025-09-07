import { baseURL } from '@/lib/axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const healthFetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'HEAD',
    cache: 'no-cache',
    signal: AbortSignal.timeout(5000)
  });
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return true;
};

export function useConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [serverIssues, setServerIssues] = useState(false);

  const { error: healthError } = useSWR(`${baseURL}/health`, healthFetcher, {
    refreshInterval: 10000, 
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    dedupingInterval: 2000,
  });

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const hasNetworkErrors = healthError && (
      healthError.message?.includes('fetch') || 
      healthError.message?.includes('NetworkError') ||
      healthError.message?.includes('Failed to fetch') ||
      healthError.message?.includes('Server error') ||
      healthError.name === 'TypeError' || 
      healthError.code === 'NETWORK_ERROR'
    );

    setServerIssues(!!hasNetworkErrors);

    const handleOnline = () => {
      setIsOnline(true);
      setServerIssues(false); 
    };
    const handleOffline = () => {
      setIsOnline(false);
      setServerIssues(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [healthError]);

  return { isOnline, serverIssues };
}