"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  BookOpen,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUser } from "@/hooks/useUser";
import { coursesApi } from "@/lib/api/courses.api";
import { progressApi } from "@/lib/api/progress.api";
import { formatMinutes } from "@/lib/utils/date.utils";
import { clsx } from "clsx";
import toast from "react-hot-toast";

export default function LearnPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  // Fetch cursos del lenguaje seleccionado
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", "language", user?.selectedLanguageId],
    queryFn: () => coursesApi.getCoursesByLanguage(user!.selectedLanguageId!),
    enabled: !!user?.selectedLanguageId,
  });

  // Fetch progreso del usuario
  const { data: myProgress = [] } = useQuery({
    queryKey: ["progress", "courses"],
    queryFn: progressApi.getMyCourses,
  });

  // Iniciar curso
  const startMutation = useMutation({
    mutationFn: (courseId: string) => progressApi.startCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast.success("¡Curso iniciado! 🚀");
    },
    onError: () => toast.error("Error al iniciar el curso"),
  });

  // Fetch módulos por curso (lazy — solo cuando se expande)
  const moduleQueries: Record<string, ReturnType<typeof useQuery>> = {};
  courses.forEach((course) => {
    moduleQueries[course.id] = useQuery({
      queryKey: ["modules", course.id],
      queryFn: () => coursesApi.getModulesByCourse(course.id),
      enabled: expandedModules.has(course.id),
    });
  });

  const toggleModule = (courseId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(courseId) ? next.delete(courseId) : next.add(courseId);
      return next;
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-1">
          Mapa de aprendizaje
        </h1>
        <p className="text-gray-400">Tu camino hacia dominar la programación</p>
      </motion.div>

      {/* Lista de cursos */}
      {coursesLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-game-surface rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course, courseIndex) => {
            const progress = myProgress.find((p) => p.courseId === course.id);
            const isStarted = progress?.status === "in_progress";
            const isCompleted = progress?.status === "completed";
            const isLocked =
              courseIndex > 0 &&
              !myProgress.find(
                (p) =>
                  p.courseId === courses[courseIndex - 1].id &&
                  p.status === "completed",
              );
            const isExpanded = expandedModules.has(course.id);
            const modules =
              (moduleQueries[course.id]?.data as Awaited<
                ReturnType<typeof coursesApi.getModulesByCourse>
              >) ?? [];

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: courseIndex * 0.1 }}
              >
                {/* Course card */}
                <div
                  className={clsx(
                    "rounded-2xl border overflow-hidden transition-all duration-200",
                    isCompleted
                      ? "bg-success/5   border-success/30"
                      : isStarted
                        ? "bg-primary-500/5 border-primary-500/30 shadow-glow-primary"
                        : isLocked
                          ? "bg-game-surface border-game-border opacity-60"
                          : "bg-game-surface border-game-border hover:border-primary-500/20",
                  )}
                >
                  {/* Course header */}
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Status icon */}
                      <div
                        className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          isCompleted
                            ? "bg-success/20"
                            : isStarted
                              ? "bg-primary-500/20"
                              : isLocked
                                ? "bg-game-card"
                                : "bg-game-card",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2
                            size={24}
                            className="text-success-neon"
                          />
                        ) : isStarted ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <PlayCircle
                              size={24}
                              className="text-primary-400"
                            />
                          </motion.div>
                        ) : isLocked ? (
                          <Lock size={20} className="text-gray-600" />
                        ) : (
                          <BookOpen size={22} className="text-gray-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-white">
                            {course.title}
                          </h3>
                          {isCompleted && (
                            <Badge variant="success" size="xs">
                              ✓ Completado
                            </Badge>
                          )}
                          {isStarted && (
                            <Badge variant="primary" size="xs" dot pulse>
                              En progreso
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="ghost" size="xs">
                              Bloqueado
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mb-3">
                          {course.shortDescription}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {course.totalLessons} lecciones
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {course.estimatedHours}h
                          </span>
                          <span className="flex items-center gap-1 text-xp">
                            <Zap size={12} className="fill-xp" />
                            {course.xpReward} XP
                          </span>
                        </div>

                        {/* Progress bar si está en progreso */}
                        {isStarted && progress && (
                          <ProgressBar
                            value={progress.progressPercentage}
                            variant="primary"
                            size="sm"
                            showLabel
                            className="mt-3"
                          />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-game-border">
                      <button
                        onClick={() => !isLocked && toggleModule(course.id)}
                        disabled={isLocked}
                        className={clsx(
                          "flex items-center gap-1.5 text-xs font-medium transition-colors",
                          isLocked
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-400 hover:text-white",
                        )}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} /> Ocultar módulos
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} /> Ver {course.totalModules}{" "}
                            módulos
                          </>
                        )}
                      </button>

                      {!isLocked && (
                        <>
                          {isStarted ? (
                            <Link href={`/learn/${course.id}`}>
                              <Button variant="primary" size="sm">
                                Continuar
                              </Button>
                            </Link>
                          ) : isCompleted ? (
                            <Link href={`/learn/${course.id}`}>
                              <Button variant="ghost" size="sm">
                                Repasar
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              isLoading={startMutation.isPending}
                              onClick={() => startMutation.mutate(course.id)}
                            >
                              Iniciar curso
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Módulos expandibles */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-game-border bg-game-card/50 p-4 flex flex-col gap-2">
                          {moduleQueries[course.id]?.isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-12 bg-game-surface rounded-xl animate-pulse"
                              />
                            ))
                          ) : modules.length > 0 ? (
                            modules.map((mod, modIndex) => (
                              <motion.div
                                key={mod.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-game-surface border border-game-border"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: modIndex * 0.05 }}
                              >
                                <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-primary-400">
                                    {modIndex + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">
                                    {mod.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {mod.totalLessons} lecciones
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-xp shrink-0">
                                  <Zap size={11} className="fill-xp" />
                                  <span className="text-xs font-bold">
                                    {mod.xpReward}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-600 text-center py-2">
                              No hay módulos disponibles aún
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
