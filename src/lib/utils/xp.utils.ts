import {
  UserLevel,
  XP_THRESHOLDS,
  getXpForNextLevel,
} from "@/types/user.types";

// Calcula el porcentaje de progreso hacia el siguiente nivel
export const getXpProgress = (
  xp: number,
  level: UserLevel,
): { current: number; required: number; percentage: number } => {
  const currentThreshold = XP_THRESHOLDS[level];
  const nextLevelXp = getXpForNextLevel(level);

  if (!nextLevelXp) {
    // Nivel máximo — barra llena
    return { current: xp, required: xp, percentage: 100 };
  }

  const current = xp - currentThreshold;
  const required = nextLevelXp - currentThreshold;
  const percentage = Math.min(Math.round((current / required) * 100), 100);

  return { current, required, percentage };
};

// Formatea XP con separador de miles
export const formatXp = (xp: number): string => {
  return xp.toLocaleString("es-CO");
};

// Etiqueta del nivel
export const getLevelLabel = (level: UserLevel): string => {
  const labels: Record<UserLevel, string> = {
    [UserLevel.BEGINNER]: "Principiante",
    [UserLevel.INTERMEDIATE]: "Intermedio",
    [UserLevel.ADVANCED]: "Avanzado",
  };
  return labels[level];
};

// Color del nivel
export const getLevelColor = (level: UserLevel): string => {
  const colors: Record<UserLevel, string> = {
    [UserLevel.BEGINNER]: "text-level-beginner",
    [UserLevel.INTERMEDIATE]: "text-level-intermediate",
    [UserLevel.ADVANCED]: "text-level-advanced",
  };
  return colors[level];
};
