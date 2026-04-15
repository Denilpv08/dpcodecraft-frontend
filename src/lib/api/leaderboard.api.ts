import apiClient from "./client";
import { ApiResponse } from "@/types/api.types";

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: string;
  currentStreak: number;
  rank: number;
}

export const leaderboardApi = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(
      "/gamification/leaderboard",
    );
    return data.data!;
  },
};
