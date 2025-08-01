import { createGig } from "@/lib/gig/gig-api";
import { GigI } from "@/types/gig";
import { create } from "zustand";

interface GigStore {
    createGig: (id: string, gig: GigI) => Promise<{ status: string, message: string, gigData: GigI }>;
}

/**
 * @function useGigStore
 * @description Actions for gig operations
 */
export const useGigStore = create<GigStore>((set) => ({
    createGig: async (id, gig) => {
        const response = await createGig(id, gig);
        return response;
    },
}));
