import { User } from "../user";

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
    hasHydrated: boolean;
    setHasHydrated: (value: boolean) => void;
}