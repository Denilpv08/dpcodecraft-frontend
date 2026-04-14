"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/user.store";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setFirebaseUser, setLoading, clear } = useAuthStore();
  const { clear: clearUser } = useUserStore();

  useEffect(() => {
    // Observa cambios en el estado de autenticación de Firebase
    const unsubscribe = onAuthChange((user) => {
      setFirebaseUser(user);
      setLoading(false);

      if (!user) {
        clear();
        clearUser();
      }
    });

    // Cleanup al desmontar
    return () => unsubscribe();
  }, [setFirebaseUser, setLoading, clear, clearUser]);

  const { firebaseUser, isAuthenticated, isLoading } = useAuthStore();

  return (
    <AuthContext.Provider value={{ firebaseUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
