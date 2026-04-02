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
  // isCorrect omitido — nunca llega del backend
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
  timeLimit?: number;
  maxAttempts?: number;
  xpReward: number;
  bonusXp?: number;
}

export interface ExerciseResult {
  isCorrect: boolean;
  xpEarned: number;
  explanation: string;
  correctAnswer?: string;
  lessonCompleted: boolean;
  courseCompleted: boolean;
  newAchievements: Achievement[];
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt: string;
}
