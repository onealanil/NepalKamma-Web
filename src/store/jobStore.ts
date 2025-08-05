import { createJob } from "@/lib/job/job-api";
import { JobI } from "@/types/job";
import { create } from "zustand";

interface jobStore {
    createJob: (job: JobI) => Promise<{ status: string, message: string, jobData: JobI }>;
}

/**
 * @function UseJobStore
 * @description Actions for job operations
 */
export const useJobStore = create<jobStore>((set) => ({
    createJob: async (job) => {
        const response = await createJob(job);
        return response;
    },
}));
