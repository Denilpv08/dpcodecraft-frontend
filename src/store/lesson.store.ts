import { create } from "zustand";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

type LessonStatus = "idle" | "in_progress" | "completed" | "failed";

interface LessonState {
  // Ejercicios de la lección actual
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise | null;

  // Estado de la sesión
  status: LessonStatus;
  lives: number;
  xpEarned: number;
  correctAnswers: number;
  wrongAnswers: number;
  usedHints: boolean;

  // Resultado del último ejercicio
  lastResult: ExerciseResult | null;

  // Actions
  initLesson: (exercises: Exercise[], lives: number) => void;
  nextExercise: () => void;
  setResult: (result: ExerciseResult) => void;
  loseLife: () => void;
  useHint: () => void;
  completeLesson: () => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>()((set, get) => ({
  exercises: [],
  currentExerciseIndex: 0,
  currentExercise: null,
  status: "idle",
  lives: 5,
  xpEarned: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  usedHints: false,
  lastResult: null,

  initLesson: (exercises, lives) =>
    set({
      exercises,
      currentExerciseIndex: 0,
      currentExercise: exercises[0] || null,
      status: "in_progress",
      lives,
      xpEarned: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      usedHints: false,
      lastResult: null,
    }),

  nextExercise: () => {
    const { exercises, currentExerciseIndex } = get();
    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex >= exercises.length) {
      set({ status: "completed" });
      return;
    }

    set({
      currentExerciseIndex: nextIndex,
      currentExercise: exercises[nextIndex],
      lastResult: null,
      usedHints: false,
    });
  },

  setResult: (result) => {
    const { xpEarned, correctAnswers, wrongAnswers } = get();
    set({
      lastResult: result,
      xpEarned: xpEarned + result.xpEarned,
      correctAnswers: result.isCorrect ? correctAnswers + 1 : correctAnswers,
      wrongAnswers: !result.isCorrect ? wrongAnswers + 1 : wrongAnswers,
    });
  },

  loseLife: () => {
    const { lives } = get();
    const newLives = lives - 1;
    set({
      lives: newLives,
      status: newLives <= 0 ? "failed" : "in_progress",
    });
  },

  useHint: () => set({ usedHints: true }),

  completeLesson: () => set({ status: "completed" }),

  resetLesson: () =>
    set({
      exercises: [],
      currentExerciseIndex: 0,
      currentExercise: null,
      status: "idle",
      lives: 5,
      xpEarned: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      usedHints: false,
      lastResult: null,
    }),
}));
