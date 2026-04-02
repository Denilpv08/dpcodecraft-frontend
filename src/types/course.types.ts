export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconURL?: string;
  color: string;
  order: number;
}

export interface Language {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconURL?: string;
  color: string;
  categoryIds: string[];
  difficulty: DifficultyLevel;
  tags: string[];
  totalCourses: number;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnailURL?: string;
  categoryId: string;
  languageId: string;
  difficulty: DifficultyLevel;
  status: CourseStatus;
  totalModules: number;
  totalLessons: number;
  estimatedHours: number;
  xpReward: number;
  prerequisites: string[];
  order: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  totalLessons: number;
  xpReward: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  slug: string;
  type: "theory" | "practice" | "mixed" | "challenge";
  content: string;
  codeExample?: string;
  language: string;
  order: number;
  totalExercises: number;
  estimatedMinutes: number;
  xpReward: number;
  isBonus: boolean;
}
