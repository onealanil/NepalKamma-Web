import { createGig } from "@/lib/gig/gig-api";
import { CreateGigI } from "@/types/gig";
import { create } from "zustand";

interface GigStore {
    createGig: (gig: CreateGigI) => Promise<{ status: string, message: string, gigData: CreateGigI }>;
}

/**
 * @function useGigStore
 * @description Actions for gig operations
 */
export const useGigStore = create<GigStore>(() => ({
    createGig: async (gig) => {
        const response = await createGig(gig);
        return response;
    },
}));
