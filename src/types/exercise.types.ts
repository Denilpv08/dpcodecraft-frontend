export enum ExerciseType {
  MULTIPLE_CHOICE = "multiple_choice",
  CODE_COMPLETION = "code_completion",
  DEBUGGING = "debugging",
  OUTPUT_PREDICTION = "output_prediction",
  CODE_WRITING = "code_writing",
  ORDERING = "ordering",
}

export enum ExerciseDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface ExerciseOption {
  id: string;
  text: string;
  // isCorrect omitido — nunca llega del backend al frontend
}

export interface Exercise {
  id: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  title: string;
  instructions: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  starterCode?: string;
  options?: ExerciseOption[];
  explanation: string;
  order: number;
  timeLimit?: number; // Segundos — undefined = sin límite
  maxAttempts?: number; // undefined = ilimitado
  xpReward: number;
  bonusXp?: number;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt: string; // ISO string
}

// Resultado que devuelve el backend al completar un ejercicio
export interface ExerciseResult {
  isCorrect: boolean;
  xpEarned: number;
  explanation: string;
  correctAnswer?: string; // Solo si la respuesta fue incorrecta
  lessonCompleted: boolean; // Si este ejercicio completó la lección
  courseCompleted: boolean; // Si este ejercicio completó el curso
  newAchievements: Achievement[]; // Logros desbloqueados en esta acción
}

// ← Faltaba este tipo — payload para enviar al endpoint /progress/exercises/complete
export interface CompleteExerciseDto {
  answer: string; // Respuesta del usuario
  exerciseId: string; // ID del ejercicio respondido
  lessonId: string; // ID de la lección que contiene el ejercicio
  usedHints?: boolean; // Si usó hints — afecta el bonus XP
}

// Vista resumida del progreso de una lección — usada en hooks y stores
export interface LessonProgressSummary {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  completedExerciseIds: string[];
  totalExercises: number;
  xpEarned: number;
  completedAt: string | null;
}

// Vista resumida del progreso de un curso — usada en el dashboard
export interface CourseProgressSummary {
  id: string;
  userId: string;
  courseId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercentage: number;
  completedLessons: number;
  completedExercises: number;
  totalExercises: number;
  xpEarned: number;
  startedAt: string;
  completedAt: string | null;
  lastActivityAt: string;
}
