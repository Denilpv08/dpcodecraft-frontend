import apiClient from "./client";
import {
  Course,
  Category,
  Language,
  CourseModule,
  Lesson,
} from "@/types/course.types";
import { ApiResponse } from "@/types/api.types";

export const coursesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } =
      await apiClient.get<ApiResponse<Category[]>>("/categories");
    return data.data!;
  },

  getLanguagesByCategory: async (categoryId: string): Promise<Language[]> => {
    const { data } = await apiClient.get<ApiResponse<Language[]>>(
      `/languages/category/${categoryId}`,
    );
    return data.data!;
  },

  getCoursesByLanguage: async (languageId: string): Promise<Course[]> => {
    const { data } = await apiClient.get<ApiResponse<Course[]>>(
      `/courses/language/${languageId}`,
    );
    return data.data!;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data!;
  },

  getModulesByCourse: async (courseId: string): Promise<CourseModule[]> => {
    const { data } = await apiClient.get<ApiResponse<CourseModule[]>>(
      `/courses/${courseId}/modules`,
    );
    return data.data!;
  },

  getLessonsByModule: async (moduleId: string): Promise<Lesson[]> => {
    const { data } = await apiClient.get<ApiResponse<Lesson[]>>(
      `/modules/${moduleId}/lessons`,
    );
    return data.data!;
  },

  getLessonById: async (lessonId: string): Promise<Lesson> => {
    const { data } = await apiClient.get<ApiResponse<Lesson>>(
      `/lessons/${lessonId}`,
    );
    return data.data!;
  },
};
