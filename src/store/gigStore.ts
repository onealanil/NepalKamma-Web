import { createGig, fetchUserGigs } from "@/lib/gig/gig-api";
import { GigI } from "@/types/gig";
import { create } from "zustand";

interface GigStore {
    gigs: GigI[];
    fetchGigs: () => Promise<void>;
    createGig: (id: string, gig: GigI) => Promise<{ status: string, message: string, gigData: GigI }>;
    updateGig: (id: number, updateGig: GigI) => Promise<void>;
    deleteGig: (id: number) => Promise<void>;
    fetchUserGigs: (id: string) => Promise<void>;
    hasHydrated: boolean;
    setHasHydrated: (value: boolean) => void;
}

/**
 * @function useGigStore
 * @description CRUd for gig
 */
export const useGigStore = create<GigStore>((set) => ({
    gigs: [],
    fetchGigs: async () => {
    },
    createGig: async (id, gig) => {
        const response = await createGig(id, gig);
        set((state) => ({ gigs: [...state.gigs, response.gigData] }));
        return response;
    },
    updateGig: async (id, updateGig) => {

    },
    deleteGig: async (id) => {

    },
    fetchUserGigs: async (id) => {
        const response = await fetchUserGigs(id);
        set({ gigs: response.userGigs });
        set({ hasHydrated: true }); 
    },
    hasHydrated: false,
    setHasHydrated: (value: boolean) => set({ hasHydrated: value })

})
)
