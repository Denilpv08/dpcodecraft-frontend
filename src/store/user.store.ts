import { create } from "zustand";
import { User, UserLevel } from "@/types/user.types";

interface UserState {
  user: User | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  addXp: (amount: number) => void;
  updateStreak: (streak: number) => void;
  loseLife: () => void;
  gainLife: () => void;
  addAchievement: (achievementKey: string) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ isLoading: loading }),

  // Actualiza XP localmente — optimistic update antes de la respuesta del backend
  addXp: (amount) => {
    const { user } = get();
    if (!user) return;

    const newXp = user.xp + amount;
    const newLevel = calculateLevel(newXp);

    set({
      user: {
        ...user,
        xp: newXp,
        level: newLevel,
      },
    });
  },

  updateStreak: (streak) => {
    const { user } = get();
    if (!user) return;
    set({
      user: {
        ...user,
        currentStreak: streak,
        longestStreak: Math.max(streak, user.longestStreak),
      },
    });
  },

  loseLife: () => {
    const { user } = get();
    if (!user || user.lives <= 0) return;
    set({ user: { ...user, lives: user.lives - 1 } });
  },

  gainLife: () => {
    const { user } = get();
    if (!user || user.lives >= 5) return;
    set({ user: { ...user, lives: user.lives + 1 } });
  },

  addAchievement: (achievementKey) => {
    const { user } = get();
    if (!user) return;
    if (user.achievements.includes(achievementKey)) return;
    set({
      user: {
        ...user,
        achievements: [...user.achievements, achievementKey],
      },
    });
  },

  clear: () => set({ user: null, isLoading: false }),
}));

// Calcula nivel según XP — espeja la lógica del backend
const calculateLevel = (xp: number): UserLevel => {
  if (xp >= 1500) return UserLevel.ADVANCED;
  if (xp >= 500) return UserLevel.INTERMEDIATE;
  return UserLevel.BEGINNER;
};
