"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Si está autenticado pero no eligió categoría/lenguaje → onboarding
    if (!userLoading && user && !user.selectedCategoryId) {
      router.replace("/onboarding");
    }
  }, [user, userLoading, router]);

  if (authLoading || userLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-game-bg">
      <Navbar />

      {/* Contenido con padding por la navbar fija */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
