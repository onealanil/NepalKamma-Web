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
    <>
      <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[99] pointer-events-none" />

      <div className="fixed top-0 left-0 w-full z-[100] transform transition-transform duration-500 ease-out animate-slideDown">
        <div className={`
          relative overflow-hidden
          ${!isOnline
            ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700'
            : 'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600'
          }
          shadow-2xl
          border-b-2 border-white/20
        `}>

          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`
                  w-3 h-3 rounded-full animate-pulse
                  ${!isOnline ? 'bg-red-200' : 'bg-amber-200'}
                  shadow-lg shadow-white/20
                `} />
                <div className={`
                  w-2 h-2 rounded-full animate-pulse animation-delay-150
                  ${!isOnline ? 'bg-red-300' : 'bg-amber-300'}
                `} />
                <div className={`
                  w-1.5 h-1.5 rounded-full animate-pulse animation-delay-300
                  ${!isOnline ? 'bg-red-400' : 'bg-amber-400'}
                `} />
              </div>

              <div className="text-white font-semibold text-lg tracking-wide drop-shadow-lg">
                {message}
              </div>

              <div className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                backdrop-blur-sm border border-white/30
                ${!isOnline
                  ? 'bg-red-400/30 text-red-100'
                  : 'bg-amber-400/30 text-amber-100'
                }
              `}>
                {!isOnline ? 'Offline' : 'Degraded'}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div className={`
              h-full w-full animate-pulse
              ${!isOnline
                ? 'bg-gradient-to-r from-red-300 via-red-200 to-red-300'
                : 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300'
              }
            `} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[100] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-xs text-gray-600 mb-2 font-medium"> Status:</div>
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">
            {!isOnline ? 'Offline' : serverIssues ? 'Server Issues' : 'Online'}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            transform: translateX(100%);
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </>
  );
}