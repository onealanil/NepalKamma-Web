import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    _id: string,
    email: string,
    username: string,
    role: string,
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setUser: (user) => set({ user }),
            setAccessToken: (token: string) => set({ accessToken: token }),
            logout: () => set({ user: null, accessToken: null })
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({ user: state.user })
        }
    )
)