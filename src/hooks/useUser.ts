"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { usersApi } from "@/lib/api/users.api";
import { useUserStore } from "@/store/user.store";
import { useAuth } from "./useAuth";

export const useUser = () => {
  const { isAuthenticated } = useAuth();
  const { user, setUser, setLoading } = useUserStore();

  const query = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => usersApi.getMe(),
    enabled: isAuthenticated, // Solo hace fetch si está autenticado
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return {
    user: user ?? query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
