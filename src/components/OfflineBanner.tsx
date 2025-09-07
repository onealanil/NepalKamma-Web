"use client";

import { useState, useEffect } from 'react';
import { useConnectivityStatus } from '@/hooks/useConnectivityStatus';

export default function OfflineBanner() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { isOnline, serverIssues } = useConnectivityStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isOnline && !serverIssues) {
    return null;
  }

  const message = !isOnline 
    ? "🚨 You are offline" 
    : "🚨 Server is unreachable";

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50 shadow-lg">
      {message}
    </div>
  );
}