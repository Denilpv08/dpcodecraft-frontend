"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "@/lib/api/progress.api";
import { useUserStore } from "@/store/user.store";
import { useLessonStore } from "@/store/lesson.store";
import { CompleteExerciseDto } from "@/types/exercise.types";
import toast from "react-hot-toast";

export const useProgress = () => {
  const queryClient = useQueryClient();
  const { addXp, addAchievement } = useUserStore();
  const { setResult, loseLife } = useLessonStore();

  // Cursos iniciados por el usuario
  const { data: myCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["progress", "courses"],
    queryFn: () => progressApi.getMyCourses(),
  });

  // Iniciar un curso
  const startCourseMutation = useMutation({
    mutationFn: (courseId: string) => progressApi.startCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", "courses"] });
      toast.success("¡Curso iniciado! A aprender 🚀");
    },
    onError: () => {
      toast.error("No se pudo iniciar el curso");
    },
  });

  // Completar un ejercicio
  const completeExerciseMutation = useMutation({
    mutationFn: (dto: CompleteExerciseDto) => progressApi.completeExercise(dto),
    onSuccess: (result) => {
      setResult(result);

      if (result.isCorrect) {
        // Optimistic update de XP
        addXp(result.xpEarned);

        // Registrar nuevos logros
        result.newAchievements.forEach((a) => {
          addAchievement(a.key);
        });

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        queryClient.invalidateQueries({ queryKey: ["progress"] });
      } else {
        // Respuesta incorrecta — pierde una vida
        loseLife();
      }
    },
    onError: () => {
      toast.error("Error al enviar la respuesta");
    },
  });

  return {
    myCourses: myCourses ?? [],
    coursesLoading,
    startCourse: startCourseMutation.mutate,
    completeExercise: completeExerciseMutation.mutate,
    isSubmitting: completeExerciseMutation.isPending,
  };
};
