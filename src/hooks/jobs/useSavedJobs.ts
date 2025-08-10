import { useEffect } from 'react';
import { useSavedJobsStore } from '@/store/savedJobsStore';
import { JobI } from '@/types/job';

/**
 * Custom hook for managing saved jobs
 * Provides easy access to saved jobs functionality
 */
export const useSavedJobs = () => {
  const {
    savedJobIds,
    savedJobs,
    isLoading,
    error,
    saveJobAction,
    unsaveJobAction,
    fetchSavedJobs,
    isSaved,
    clearError,
    addJobOptimistic,
    removeJobOptimistic
  } = useSavedJobsStore();

  useEffect(() => {
      fetchSavedJobs();
  }, []);

  /**
   * Toggle save/unsave a job with optimistic updates
   */
  const toggleSaveJob = async (job: JobI): Promise<boolean> => {
    const jobId = job._id;
    const isCurrentlySaved = isSaved(jobId);

    if (isCurrentlySaved) {
      // Optimistic update for unsaving
      removeJobOptimistic(jobId);
      const success = await unsaveJobAction(jobId);
      
      if (!success) {
        // Revert optimistic update if failed
        addJobOptimistic(job);
      }
      
      return success;
    } else {
      // Optimistic update for saving
      addJobOptimistic(job);
      const success = await saveJobAction(jobId);
      
      if (!success) {
        // Revert optimistic update if failed
        removeJobOptimistic(jobId);
      }
      
      return success;
    }
  };

  /**
   * Save a job with optimistic updates
   */
  const saveJob = async (job: JobI): Promise<boolean> => {
    if (isSaved(job._id)) {
      return true; // Already saved
    }

    // Optimistic update
    addJobOptimistic(job);
    const success = await saveJobAction(job._id);
    
    if (!success) {
      // Revert optimistic update if failed
      removeJobOptimistic(job._id);
    }
    
    return success;
  };

  /**
   * Unsave a job with optimistic updates
   */
  const unsaveJob = async (jobId: string): Promise<boolean> => {
    if (!isSaved(jobId)) {
      return true; // Already unsaved
    }

    // Find the job to remove for optimistic update
    const jobToRemove = savedJobs.find(job => job._id === jobId);
    
    // Optimistic update
    removeJobOptimistic(jobId);
    const success = await unsaveJobAction(jobId);
    
    if (!success && jobToRemove) {
      // Revert optimistic update if failed
      addJobOptimistic(jobToRemove);
    }
    
    return success;
  };

  /**
   * Get saved status for a specific job
   */
  const getSavedStatus = (jobId: string) => {
    return {
      isSaved: isSaved(jobId),
      isLoading,
      error
    };
  };

  /**
   * Get saved jobs count
   */
  const getSavedJobsCount = () => savedJobIds.length;

  return {
    // State
    savedJobs,
    savedJobIds,
    isLoading,
    error,
    
    // Actions
    saveJob,
    unsaveJob,
    toggleSaveJob,
    fetchSavedJobs,
    clearError,
    
    // Utilities
    isSaved,
    getSavedStatus,
    getSavedJobsCount,
    
    // Computed
    hasSavedJobs: savedJobIds.length > 0,
    savedJobsCount: savedJobIds.length
  };
};

/**
 * Hook for checking if a specific job is saved
 * Optimized for components that only need to know save status
 */
export const useJobSaveStatus = (jobId: string) => {
  const isSaved = useSavedJobsStore(state => state.isSaved(jobId));
  const isLoading = useSavedJobsStore(state => state.isLoading);
  const error = useSavedJobsStore(state => state.error);

  return {
    isSaved,
    isLoading,
    error
  };
};

/**
 * Hook for saved jobs count (for badges, etc.)
 */
export const useSavedJobsCount = () => {
  const count = useSavedJobsStore(state => state.savedJobIds.length);
  return count;
};
