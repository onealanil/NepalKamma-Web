import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveJob, unsaveJob, getSavedJobs } from '@/lib/job/job-api';
import { JobI } from '@/types/job';

interface SavedJobsState {
  // State
  savedJobIds: string[];
  savedJobs: JobI[];
  isLoading: boolean;
  error: string | null;

  // Actions
  saveJobAction: (jobId: string) => Promise<boolean>;
  unsaveJobAction: (jobId: string) => Promise<boolean>;
  fetchSavedJobs: () => Promise<void>;
  isSaved: (jobId: string) => boolean;
  clearError: () => void;
  clearSavedJobs: () => void;

  // Optimistic updates
  addJobOptimistic: (job: JobI) => void;
  removeJobOptimistic: (jobId: string) => void;
}

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      // Initial state
      savedJobIds: [],
      savedJobs: [],
      isLoading: false,
      error: null,

      // Check if a job is saved
      isSaved: (jobId: string) => {
        return get().savedJobIds.includes(jobId);
      },

      // Save a job
      saveJobAction: async (jobId: string) => {
        const { savedJobIds } = get();
        set({ isLoading: true, error: null });

        // if it is already in store, skip the optimistic update 
        if (!savedJobIds.includes(jobId)) {
          set(sate => ({
            savedJobIds: [...sate.savedJobIds, jobId]
          }))
        }

        try {
          const response = await saveJob(jobId);
          if (response.success) {
            set({ isLoading: false });
            return true;
          } else {
            if (!savedJobIds.includes(jobId)) {
              set(sate => ({
                savedJobIds: sate.savedJobIds.filter(id => id !== jobId)
              }))
            }
            set({ isLoading: false, error: response.message || 'Failed to save job' });
            return false;
          }
        } catch (error) {
          if (!savedJobIds.includes(jobId)) {
            set(sate => ({
              savedJobIds: sate.savedJobIds.filter(id => id !== jobId)
            }))
          }
          set({ isLoading: false, error: 'Failed to save job. Please try again.' });
          return false;
        }
      },
      // Unsave a job 
      unsaveJobAction: async (jobId: string) => {
        const { savedJobIds } = get();
        set({ isLoading: true, error: null });

        // If it's in store, remove it optimistically
        if (savedJobIds.includes(jobId)) {
          set(state => ({
            savedJobIds: state.savedJobIds.filter(id => id !== jobId),
            savedJobs: state.savedJobs.filter(job => job._id !== jobId)
          }));
        }

        try {
          const response = await unsaveJob(jobId);

          if (response.success) {
            set({ isLoading: false });
            return true;
          } else {
            // If optimistic update happened, revert
            if (savedJobIds.includes(jobId)) {
              set(state => ({
                savedJobIds: [...state.savedJobIds, jobId],
                error: response.message || 'Failed to unsave job',
              }));
            }
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          // If optimistic update happened, revert
          if (savedJobIds.includes(jobId)) {
            set(state => ({
              savedJobIds: [...state.savedJobIds, jobId],
              error: 'Failed to unsave job. Please try again.',
            }));
          }
          set({ isLoading: false });
          return false;
        }
      },


      // Fetch all saved jobs
      fetchSavedJobs: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await getSavedJobs();

          if (response.success && response.data) {
            const jobs = response.data.savedPosts;
            const jobIds = jobs.map((job: JobI) => job._id);

            set({
              savedJobs: jobs,
              savedJobIds: jobIds,
              isLoading: false,
              error: null
            });
          } else {
            set({
              error: response.message || 'Failed to fetch saved jobs',
              isLoading: false
            });
          }
        } catch (error) {
          set({
            error: 'Failed to fetch saved jobs. Please try again.',
            isLoading: false
          });
        }
      },

      // Optimistic updates for better UX
      addJobOptimistic: (job: JobI) => {
        set(state => ({
          savedJobs: [...state.savedJobs, job],
          savedJobIds: [...state.savedJobIds, job._id].filter(Boolean) as string[]
        }));
      },

      removeJobOptimistic: (jobId: string) => {
        set(state => ({
          savedJobs: state.savedJobs.filter(job => job._id !== jobId),
          savedJobIds: state.savedJobIds.filter(id => id !== jobId)
        }));
      },
      clearSavedJobs: () => {
        set({ savedJobs: [], savedJobIds: [], error: null, isLoading: false });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'saved-jobs-storage',
      partialize: (state) => ({
        savedJobIds: state.savedJobIds,
      })
    }
  )
);

// Selectors for better performance
export const useSavedJobIds = () => useSavedJobsStore(state => state.savedJobIds);
export const useSavedJobs = () => useSavedJobsStore(state => state.savedJobs);
export const useIsSaved = (jobId: string) => useSavedJobsStore(state => state.isSaved(jobId));
export const useSavedJobsLoading = () => useSavedJobsStore(state => state.isLoading);
export const useSavedJobsError = () => useSavedJobsStore(state => state.error);
