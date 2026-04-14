import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User as FirebaseUser } from "firebase/auth";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setFirebaseUser: (user) =>
        set({
          firebaseUser: user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      setLoading: (loading) => set({ isLoading: loading }),

      clear: () =>
        set({
          firebaseUser: null,
          isAuthenticated: false,
          token: null,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      // Solo persistimos datos no sensibles
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
