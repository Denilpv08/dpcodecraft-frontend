import apiClient from "./client";
import { Exercise } from "@/types/exercise.types";
import { ApiResponse } from "@/types/api.types";

export const exercisesApi = {
  getByLessonId: async (lessonId: string): Promise<Exercise[]> => {
    const { data } = await apiClient.get<ApiResponse<Exercise[]>>(
      `/lessons/${lessonId}/exercises`,
    );
    return data.data!;
  },

  getById: async (lessonId: string, exerciseId: string): Promise<Exercise> => {
    const { data } = await apiClient.get<ApiResponse<Exercise>>(
      `/lessons/${lessonId}/exercises/${exerciseId}`,
    );
    return data.data!;
  },
};
