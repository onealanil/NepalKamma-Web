import { createJob, fetchNearbyJobs } from "@/lib/job/job-api";
import { ApiResponse } from "@/types/job-provider/job-api";
import { JobI } from "@/types/job";
import { create } from "zustand";

interface jobStore {
    createJob: (job: JobI) => Promise<ApiResponse>;
}

/**
 * @function UseJobStore
 * @description Actions for job operations
 */
export const useJobStore = create<jobStore>(() => ({
    createJob: async (job) => {
        const response = await createJob(job);
        return response;
    },
}));
