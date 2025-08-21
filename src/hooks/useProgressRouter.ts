'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export const useProgressRouter = () => {
  const router = useRouter();

  useEffect(() => {
    // Configure NProgress with better settings
    if (NProgress) {
      NProgress.configure({
        showSpinner: false,
        easing: 'ease',
        speed: 800, // Slower for visibility
        minimum: 0.1,
        trickle: true,
        trickleSpeed: 200
      });
    }
  }, []);

  const handleNavigation = (navigationFn: () => void, minDuration: number = 800) => {
    if (NProgress) {
      NProgress.start();
      
      // Ensure minimum visibility duration
      const startTime = Date.now();
      
      const finishProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);
        
        setTimeout(() => {
          if (NProgress) NProgress.done();
        }, remaining);
      };

      // Call the navigation function
      navigationFn();
      
      // Set up the finish timer
      finishProgress();
    } else {
      navigationFn();
    }
  };

  const push = (href: string) => {
    handleNavigation(() => router.push(href));
  };

  const replace = (href: string) => {
    handleNavigation(() => router.replace(href));
  };

  const back = () => {
    handleNavigation(() => router.back());
  };

  const forward = () => {
    handleNavigation(() => router.forward());
  };

  const refresh = () => {
    handleNavigation(() => router.refresh(), 1200); // Longer for refresh
  };

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    router
  };
};