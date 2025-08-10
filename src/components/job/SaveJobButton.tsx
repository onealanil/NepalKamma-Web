"use client";

import React from 'react';
import { useSavedJobs, useJobSaveStatus } from '@/hooks/jobs/useSavedJobs';
import { JobI } from '@/types/job';
import { ErrorToast, SuccessToast } from '../ui/Toast';

interface SaveJobButtonProps {
  job: JobI;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const SaveJobButton: React.FC<SaveJobButtonProps> = ({
  job,
  variant = 'icon',
  size = 'md',
  className = '',
  showText = false
}) => {
  const { toggleSaveJob } = useSavedJobs();
  const { isSaved, isLoading } = useJobSaveStatus(job._id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await toggleSaveJob(job);
    
    if (success) {
      if (isSaved) {
        SuccessToast("Job removed from saved jobs!");
      } else {
        SuccessToast("Job saved successfully!");
      }
    } else {
      ErrorToast("Failed to update saved jobs. Please try again.");
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Button size classes
  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Heart icon
  const HeartIcon = () => (
    <svg
      className={`${iconSizeClasses[size]} transition-all duration-200 ${
        isSaved 
          ? 'text-red-500 fill-current' 
          : 'text-gray-400 hover:text-red-400'
      }`}
      fill={isSaved ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  // Bookmark icon (alternative)
  const BookmarkIcon = () => (
    <svg
      className={`${iconSizeClasses[size]} transition-all duration-200 ${
        isSaved 
          ? 'text-primary fill-current' 
          : 'text-gray-400 hover:text-primary'
      }`}
      fill={isSaved ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );

  // Loading spinner
  const LoadingSpinner = () => (
    <div className={`${iconSizeClasses[size]} animate-spin`}>
      <svg className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]}
          rounded-full
          hover:bg-gray-100
          transition-all
          duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          ${className}
        `}
        title={isSaved ? 'Remove from saved jobs' : 'Save job'}
      >
        {isLoading ? <LoadingSpinner /> : <BookmarkIcon />}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`
          ${buttonSizeClasses[size]}
          flex
          items-center
          gap-2
          rounded-lg
          font-medium
          transition-all
          duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${
            isSaved
              ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }
          ${className}
        `}
      >
        {isLoading ? <LoadingSpinner /> : <BookmarkIcon />}
        {showText && (
          <span>{isSaved ? 'Saved' : 'Save Job'}</span>
        )}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`
          ${buttonSizeClasses[size]}
          flex
          items-center
          gap-2
          font-medium
          transition-all
          duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${
            isSaved
              ? 'text-primary hover:text-primary/80'
              : 'text-gray-600 hover:text-primary'
          }
          ${className}
        `}
      >
        {isLoading ? <LoadingSpinner /> : <BookmarkIcon />}
        <span>{isSaved ? 'Saved' : 'Save Job'}</span>
      </button>
    );
  }

  return null;
};

export default SaveJobButton;
