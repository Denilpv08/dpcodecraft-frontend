"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Zap,
  Flame,
  BookOpen,
  Target,
  Edit3,
  Check,
  X,
  Camera,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { XPBar } from "@/components/game/XPBar";
import { StreakCounter } from "@/components/game/StreakCounter";
import { LevelBadge } from "@/components/game/LevelBadge";
import { LivesDisplay } from "@/components/game/LivesDisplay";
import { useUser } from "@/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users.api";
import { useUserStore } from "@/store/user.store";
import { progressApi } from "@/lib/api/progress.api";
import { formatDate, formatXp } from "@/lib/utils/xp.utils";
import { clsx } from "clsx";
import toast from "react-hot-toast";

// Definición visual de logros
const ACHIEVEMENT_META: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  first_lesson: {
    icon: "📖",
    label: "Primera Lección",
    color: "from-success to-success-neon",
  },
  first_course: {
    icon: "🎓",
    label: "Primer Curso",
    color: "from-primary-500 to-primary-300",
  },
  streak_3: {
    icon: "🔥",
    label: "Racha 3 días",
    color: "from-streak to-streak-fire",
  },
  streak_7: { icon: "⚡", label: "Racha Semanal", color: "from-xp to-xp-glow" },
  streak_30: {
    icon: "💫",
    label: "Racha del Mes",
    color: "from-purple-500 to-pink-400",
  },
  xp_100: { icon: "✨", label: "100 XP", color: "from-xp to-yellow-300" },
  xp_500: { icon: "🌟", label: "500 XP", color: "from-xp to-xp-glow" },
  xp_1000: {
    icon: "👑",
    label: "1000 XP Maestro",
    color: "from-purple-500 to-xp",
  },
  exercises_10: {
    icon: "💪",
    label: "10 Ejercicios",
    color: "from-success to-primary-500",
  },
  exercises_50: {
    icon: "🚀",
    label: "50 Ejercicios",
    color: "from-primary-500 to-purple-500",
  },
  exercises_100: {
    icon: "🏆",
    label: "100 Ejercicios",
    color: "from-xp to-streak",
  },
  perfect_lesson: {
    icon: "💎",
    label: "Lección Perfecta",
    color: "from-purple-500 to-pink-400",
  },
  speed_run: {
    icon: "⚡",
    label: "Speed Run",
    color: "from-primary-400 to-success",
  },
};

type ProfileTab = "overview" | "achievements" | "progress";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, refetch } = useUser();
  const { setUser } = useUserStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // Fetch progreso de cursos
  const { data: myProgress = [] } = useQuery({
    queryKey: ["progress", "courses"],
    queryFn: progressApi.getMyCourses,
  });

  // Mutation para actualizar nombre
  const updateMutation = useMutation({
    mutationFn: (displayName: string) => usersApi.updateMe({ displayName }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditingName(false);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success("Nombre actualizado");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const handleSaveName = () => {
    if (!newName.trim() || newName === user?.displayName) {
      setIsEditingName(false);
      return;
    }
    updateMutation.mutate(newName.trim());
  };

  if (!user) return null;

  const completedCourses = myProgress.filter(
    (p) => p.status === "completed",
  ).length;
  const inProgressCourses = myProgress.filter(
    (p) => p.status === "in_progress",
  ).length;
  const totalXpFromCourses = myProgress.reduce((sum, p) => sum + p.xpEarned, 0);

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "achievements", label: "Logros", icon: "🏆" },
    { id: "progress", label: "Progreso", icon: "📈" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* ── Header del perfil ───────────────────────────────── */}
        <Card variant="default" padding="lg">
          {/* Fondo decorativo */}
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-r from-primary-500/10 via-purple-500/10 to-transparent rounded-t-2xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar con botón de edición */}
            <div className="relative group">
              <Avatar
                src={user.photoURL}
                displayName={user.displayName}
                level={user.level}
                size="2xl"
                showLevelRing
                showOnline
              />
              <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </button>
            </div>

            {/* Info del usuario */}
            <div className="flex-1 min-w-0">
              {/* Nombre editable */}
              <div className="flex items-center gap-2 mb-1">
                <AnimatePresence mode="wait">
                  {isEditingName ? (
                    <motion.div
                      key="editing"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                        className="bg-game-card border border-primary-500/40 rounded-lg px-3 py-1.5 text-xl font-black text-white outline-none focus:border-primary-400 w-48"
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1.5 rounded-lg bg-success/20 text-success-neon hover:bg-success/30 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <h1 className="text-2xl font-black text-white">
                        {user.displayName}
                      </h1>
                      <button
                        onClick={() => {
                          setNewName(user.displayName);
                          setIsEditingName(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => {
                    setNewName(user.displayName);
                    setIsEditingName(true);
                  }}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Edit3 size={13} />
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-3">{user.email}</p>

              <div className="flex items-center flex-wrap gap-2">
                <LevelBadge level={user.level} size="md" />
                <Badge variant="ghost" size="sm">
                  Miembro desde {formatDate(user.createdAt)}
                </Badge>
              </div>
            </div>

            {/* Stats rápidos */}
            <div className="hidden lg:flex items-center gap-4">
              <LivesDisplay lives={user.lives} />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-6">
            <XPBar xp={user.xp} level={user.level} showDetails />
          </div>
        </Card>

        {/* ── Stats grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "XP Total",
              value: formatXp(user.xp),
              icon: "⚡",
              color: "text-xp",
            },
            {
              label: "Racha actual",
              value: `${user.currentStreak} días`,
              icon: "🔥",
              color: "text-streak-fire",
            },
            {
              label: "Mejor racha",
              value: `${user.longestStreak} días`,
              icon: "🏅",
              color: "text-purple-400",
            },
            {
              label: "Logros",
              value: user.achievements.length,
              icon: "🏆",
              color: "text-xp-glow",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-game-surface border border-game-border rounded-2xl p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className={clsx("text-xl font-black", stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 p-1 bg-game-surface border border-game-border rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300",
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute inset-0 bg-primary-500/15 border border-primary-500/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Contenido de tabs ───────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── OVERVIEW ──────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Racha */}
                <Card variant="default" padding="md">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Racha de estudio
                  </h3>
                  <div className="flex items-center justify-between">
                    <StreakCounter streak={user.currentStreak} showLabel />
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Mejor racha</p>
                      <p className="text-lg font-black text-purple-400">
                        {user.longestStreak} días
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Cursos */}
                <Card variant="default" padding="md">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Cursos
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Completados",
                        value: completedCourses,
                        color: "text-success-neon",
                      },
                      {
                        label: "En progreso",
                        value: inProgressCourses,
                        color: "text-primary-400",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-3 bg-game-card rounded-xl"
                      >
                        <p className={clsx("text-2xl font-black", item.color)}>
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Lecciones completadas */}
                <Card variant="default" padding="md">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Lecciones completadas
                  </h3>
                  <div className="flex items-end gap-3">
                    <p className="text-4xl font-black text-primary-400">
                      {user.completedLessons.length}
                    </p>
                    <div className="pb-1">
                      <BookOpen size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <ProgressBar
                    value={Math.min(
                      (user.completedLessons.length / 100) * 100,
                      100,
                    )}
                    variant="primary"
                    size="xs"
                    className="mt-3"
                  />
                  <p className="text-[11px] text-gray-600 mt-1">
                    Meta: 100 lecciones
                  </p>
                </Card>

                {/* XP por cursos */}
                <Card variant="default" padding="md">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    XP por cursos
                  </h3>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-xp">
                      {formatXp(totalXpFromCourses)}
                    </p>
                    <Zap size={20} className="text-xp fill-xp pb-1" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    de {formatXp(user.xp)} XP totales
                  </p>
                </Card>
              </div>
            )}

            {/* ── ACHIEVEMENTS ──────────────────────────────── */}
            {activeTab === "achievements" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-bold">
                      {user.achievements.length}
                    </span>{" "}
                    de {Object.keys(ACHIEVEMENT_META).length} logros
                    desbloqueados
                  </p>
                  <ProgressBar
                    value={Math.round(
                      (user.achievements.length /
                        Object.keys(ACHIEVEMENT_META).length) *
                        100,
                    )}
                    variant="xp"
                    size="xs"
                    className="w-32"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(ACHIEVEMENT_META).map(([key, meta], i) => {
                    const isUnlocked = user.achievements.includes(key);
                    return (
                      <motion.div
                        key={key}
                        className={clsx(
                          "relative p-4 rounded-2xl border transition-all duration-200 overflow-hidden",
                          isUnlocked
                            ? "bg-game-surface border-xp/30"
                            : "bg-game-surface border-game-border opacity-40",
                        )}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: isUnlocked ? 1 : 0.4, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      >
                        {/* Fondo de gradiente si está desbloqueado */}
                        {isUnlocked && (
                          <div
                            className={clsx(
                              "absolute inset-0 opacity-10 bg-linear-to-br",
                              meta.color,
                            )}
                          />
                        )}

                        <div className="relative z-10">
                          <div
                            className={clsx(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3",
                              isUnlocked
                                ? `bg-linear-to-br ${meta.color}`
                                : "bg-game-card",
                            )}
                          >
                            {isUnlocked ? meta.icon : "🔒"}
                          </div>
                          <p
                            className={clsx(
                              "text-sm font-bold",
                              isUnlocked ? "text-white" : "text-gray-600",
                            )}
                          >
                            {meta.label}
                          </p>
                          {isUnlocked && (
                            <Badge variant="xp" size="xs" className="mt-1.5">
                              Desbloqueado
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PROGRESS ──────────────────────────────────── */}
            {activeTab === "progress" && (
              <div className="flex flex-col gap-4">
                {myProgress.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">📚</p>
                    <p className="text-gray-400 font-semibold">
                      Aún no has iniciado ningún curso
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ¡Ve al mapa de aprendizaje y comienza hoy!
                    </p>
                  </div>
                ) : (
                  myProgress.map((progress, i) => (
                    <motion.div
                      key={progress.id}
                      className="bg-game-surface border border-game-border rounded-2xl p-5"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                progress.status === "completed"
                                  ? "success"
                                  : progress.status === "in_progress"
                                    ? "primary"
                                    : "ghost"
                              }
                              size="xs"
                              dot={progress.status === "in_progress"}
                            >
                              {progress.status === "completed"
                                ? "Completado"
                                : progress.status === "in_progress"
                                  ? "En progreso"
                                  : "No iniciado"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {progress.completedLessons} lecciones ·{" "}
                            {progress.completedExercises} ejercicios
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xp">
                          <Zap size={14} className="fill-xp" />
                          <span className="text-sm font-bold">
                            +{formatXp(progress.xpEarned)}
                          </span>
                        </div>
                      </div>

                      <ProgressBar
                        value={progress.progressPercentage}
                        variant={
                          progress.status === "completed"
                            ? "success"
                            : "primary"
                        }
                        size="md"
                        showLabel
                        label={`${progress.progressPercentage}% completado`}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
