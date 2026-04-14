"use client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Zap,
  Flame,
  Trophy,
  BookOpen,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { XPBar } from "@/components/game/XPBar";
import { StreakCounter } from "@/components/game/StreakCounter";
import { LivesDisplay } from "@/components/game/LivesDisplay";
import { LevelBadge } from "@/components/game/LevelBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUser } from "@/hooks/useUser";
import { coursesApi } from "@/lib/api/courses.api";
import { progressApi } from "@/lib/api/progress.api";
import { formatXp } from "@/lib/utils/xp.utils";
import { formatDate } from "@/lib/utils/date.utils";
import { clsx } from "clsx";

// Animación stagger para cards
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
};

export default function DashboardPage() {
  const { user } = useUser();

  // Cursos del lenguaje seleccionado
  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "language", user?.selectedLanguageId],
    queryFn: () => coursesApi.getCoursesByLanguage(user!.selectedLanguageId!),
    enabled: !!user?.selectedLanguageId,
  });

  // Progreso del usuario
  const { data: myProgress = [] } = useQuery({
    queryKey: ["progress", "courses"],
    queryFn: () => progressApi.getMyCourses(),
  });

  if (!user) return null;

  // Curso en progreso
  const courseInProgress = myProgress.find((p) => p.status === "in_progress");
  const activeCourse = courses.find((c) => c.id === courseInProgress?.courseId);

  // Stats del usuario
  const stats = [
    {
      label: "XP Total",
      value: formatXp(user.xp),
      icon: Zap,
      color: "text-xp",
      bg: "bg-xp/10",
    },
    {
      label: "Racha",
      value: `${user.currentStreak} días`,
      icon: Flame,
      color: "text-streak-fire",
      bg: "bg-streak/10",
    },
    {
      label: "Logros",
      value: user.achievements.length,
      icon: Trophy,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Cursos",
      value: user.completedCourses.length,
      icon: BookOpen,
      color: "text-success-neon",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        {/* ── Saludo ──────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={user.photoURL}
              displayName={user.displayName}
              level={user.level}
              size="lg"
              showLevelRing
              showOnline
              animated
            />
            <div>
              <p className="text-gray-400 text-sm">Bienvenido de vuelta,</p>
              <h1 className="text-2xl font-black text-white">
                {user.displayName.split(" ")[0]} 👋
              </h1>
              <div className="mt-1">
                <LevelBadge level={user.level} size="sm" />
              </div>
            </div>
          </div>

          <LivesDisplay lives={user.lives} className="hidden sm:flex" />
        </motion.div>

        {/* ── XP Bar ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card variant="default" padding="md">
            <XPBar xp={user.xp} level={user.level} showDetails />
          </Card>
        </motion.div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-game-surface border border-game-border rounded-2xl p-4 flex flex-col gap-2"
              whileHover={{ scale: 1.02, borderColor: "rgba(14,165,233,0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  stat.bg,
                )}
              >
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className={clsx("text-xl font-black", stat.color)}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Contenido principal ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Curso en progreso */}
            {activeCourse && courseInProgress ? (
              <motion.div variants={itemVariants}>
                <Card variant="glow" padding="md">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="primary" dot pulse className="mb-2">
                        En progreso
                      </Badge>
                      <h2 className="text-lg font-bold text-white">
                        {activeCourse.title}
                      </h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {activeCourse.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xp shrink-0 ml-4">
                      <Zap size={14} className="fill-xp" />
                      <span className="text-sm font-bold">
                        {activeCourse.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Progreso */}
                  <ProgressBar
                    value={courseInProgress.progressPercentage}
                    variant="primary"
                    size="md"
                    showLabel
                    label={`${courseInProgress.completedLessons} / ${activeCourse.totalLessons} lecciones`}
                    striped
                    className="mb-4"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {activeCourse.totalModules} módulos
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={14} />
                        {activeCourse.estimatedHours}h estimadas
                      </span>
                    </div>

                    <Link href="/learn">
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ChevronRight size={14} />}
                      >
                        Continuar
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ) : (
              /* CTA si no hay curso en progreso */
              <motion.div variants={itemVariants}>
                <Card variant="hover" padding="md">
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="text-5xl mb-4">🚀</div>
                    <h2 className="text-lg font-bold text-white mb-2">
                      ¡Empieza tu primer curso!
                    </h2>
                    <p className="text-sm text-gray-400 mb-5">
                      Elige un curso y comienza tu aventura de aprendizaje
                    </p>
                    <Link href="/learn">
                      <Button variant="primary" size="md">
                        Ver cursos disponibles
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Lista de cursos disponibles */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white">
                  Cursos disponibles
                </h2>
                <Link
                  href="/learn"
                  className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                >
                  Ver todos <ChevronRight size={14} />
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {courses.slice(0, 3).map((course, i) => {
                  const progress = myProgress.find(
                    (p) => p.courseId === course.id,
                  );
                  const isCompleted = progress?.status === "completed";
                  const isStarted = progress?.status === "in_progress";

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href="/learn">
                        <div
                          className={clsx(
                            "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
                            "bg-game-surface border-game-border",
                            "hover:border-primary-500/30 hover:shadow-glow-primary",
                          )}
                        >
                          {/* Thumbnail / Icon */}
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/20 flex items-center justify-center shrink-0 text-xl">
                            {isCompleted ? "✅" : isStarted ? "🔥" : "📘"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-bold text-white truncate">
                                {course.title}
                              </p>
                              {isCompleted && (
                                <Badge variant="success" size="xs">
                                  Completado
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {course.totalLessons} lecciones ·{" "}
                              {course.estimatedHours}h
                            </p>
                            {isStarted && progress && (
                              <ProgressBar
                                value={progress.progressPercentage}
                                variant="primary"
                                size="xs"
                                className="mt-1.5 w-32"
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xp shrink-0">
                            <Zap size={12} className="fill-xp" />
                            <span className="text-xs font-bold">
                              {course.xpReward}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Columna derecha — 1/3 */}
          <div className="flex flex-col gap-4">
            {/* Racha */}
            <motion.div variants={itemVariants}>
              <Card variant="default" padding="md">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
                  Racha de estudio
                </h3>
                <div className="flex flex-col items-center">
                  <StreakCounter streak={user.currentStreak} showLabel />
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    Mejor racha:{" "}
                    <span className="text-gray-400 font-semibold">
                      {user.longestStreak} días
                    </span>
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Últimos logros */}
            <motion.div variants={itemVariants}>
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Logros recientes
                  </h3>
                  <Badge variant="ghost" size="xs">
                    {user.achievements.length}
                  </Badge>
                </div>

                {user.achievements.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {user.achievements.slice(0, 4).map((key, i) => (
                      <motion.div
                        key={key}
                        className="flex items-center gap-3 p-2 rounded-xl bg-game-card"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-xp to-xp-glow flex items-center justify-center shrink-0">
                          <Trophy size={14} className="text-game-bg" />
                        </div>
                        <p className="text-xs font-semibold text-gray-300 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-4xl mb-2">🏆</p>
                    <p className="text-xs text-gray-600">
                      Completa lecciones para ganar logros
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Miembro desde */}
            <motion.div variants={itemVariants}>
              <div className="p-4 rounded-2xl bg-game-surface border border-game-border text-center">
                <p className="text-xs text-gray-600">Miembro desde</p>
                <p className="text-sm font-semibold text-gray-300 mt-0.5">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
