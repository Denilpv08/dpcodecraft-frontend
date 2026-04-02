export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

export enum UserLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  level: UserLevel;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  lives: number;
  completedLessons: string[];
  completedCourses: string[];
  achievements: string[];
  selectedCategoryId: string | null;
  selectedLanguageId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// XP requerido por nivel
export const XP_THRESHOLDS: Record<UserLevel, number> = {
  [UserLevel.BEGINNER]: 0,
  [UserLevel.INTERMEDIATE]: 500,
  [UserLevel.ADVANCED]: 1500,
};

// XP para el siguiente nivel
export const getXpForNextLevel = (level: UserLevel): number | null => {
  const thresholds = {
    [UserLevel.BEGINNER]: XP_THRESHOLDS[UserLevel.INTERMEDIATE],
    [UserLevel.INTERMEDIATE]: XP_THRESHOLDS[UserLevel.ADVANCED],
    [UserLevel.ADVANCED]: null, // Nivel máximo
  };
  return thresholds[level];
};
