import apiClient from "./client";
import { ApiResponse } from "@/types/api.types";
import {
  ExerciseResult,
  CompleteExerciseDto,
  CourseProgressSummary, // ← Ahora viene de types
} from "@/types/exercise.types";

export const progressApi = {
  getMyCourses: async (): Promise<CourseProgressSummary[]> => {
    const { data } =
      await apiClient.get<ApiResponse<CourseProgressSummary[]>>(
        "/progress/courses",
      );
    return data.data!;
  },

  getCourseProgress: async (
    courseId: string,
  ): Promise<CourseProgressSummary> => {
    const { data } = await apiClient.get<ApiResponse<CourseProgressSummary>>(
      `/progress/courses/${courseId}`,
    );
    return data.data!;
  },

  startCourse: async (courseId: string): Promise<CourseProgressSummary> => {
    const { data } = await apiClient.post<ApiResponse<CourseProgressSummary>>(
      "/progress/courses/start",
      { courseId },
    );
    return data.data!;
  },

  completeExercise: async (
    dto: CompleteExerciseDto,
  ): Promise<ExerciseResult> => {
    const { data } = await apiClient.post<ApiResponse<ExerciseResult>>(
      "/progress/exercises/complete",
      dto,
    );
    return data.data!;
  },
};
