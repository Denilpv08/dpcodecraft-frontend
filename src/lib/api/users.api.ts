import apiClient from "./client";
import { User } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";

export const usersApi = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>("/users/me");
    return data.data!;
  },

  updateMe: async (payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      "/users/me",
      payload,
    );
    return data.data!;
  },

  addXp: async (amount: number, reason: string): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>("/users/me/xp", {
      amount,
      reason,
    });
    return data.data!;
  },
};
