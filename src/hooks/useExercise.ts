"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { exercisesApi } from "@/lib/api/exercises.api";
import { useLessonStore } from "@/store/lesson.store";
import { useUserStore } from "@/store/user.store";

export const useExercise = (lessonId: string) => {
  const { user } = useUserStore();
  const { initLesson, exercises, currentExercise, status } = useLessonStore();

  const query = useQuery({
    queryKey: ["exercises", lessonId],
    queryFn: () => exercisesApi.getByLessonId(lessonId),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 10, // 10 minutos — ejercicios cambian poco
  });

  // Inicializa la lección cuando llegan los ejercicios
  useEffect(() => {
    if (query.data && query.data.length > 0 && status === "idle") {
      initLesson(query.data, user?.lives ?? 5);
    }
  }, [query.data, status, initLesson, user?.lives]);

  return {
    exercises: exercises,
    currentExercise,
    isLoading: query.isLoading,
    isError: query.isError,
    status,
  };
};
