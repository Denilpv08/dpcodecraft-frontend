"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LivesDisplay } from "@/components/game/LivesDisplay";
import { XPAnimation } from "@/components/game/XPAnimation";
import { AchievementToast } from "@/components/game/AchievementToast";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { useExercise } from "@/hooks/useExercise";
import { useProgress } from "@/hooks/useProgress";
import { useLessonStore } from "@/store/lesson.store";
import { useUserStore } from "@/store/user.store";
import { coursesApi } from "@/lib/api/courses.api";
import { Achievement } from "@/types/exercise.types";
import { clsx } from "clsx";
import { ExerciseWrapper } from "@/components/exercises/ExerciseWrapper";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const { user } = useUserStore();

  // Estado de la lección
  const {
    currentExercise,
    exercises,
    currentExerciseIndex,
    status,
    lives,
    xpEarned,
    correctAnswers,
    lastResult,
  } = useLessonStore();

  const { isLoading } = useExercise(lessonId);
  const { completeExercise, isSubmitting } = useProgress();

  // Animaciones
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  // Fetch info de la lección
  const { data: lesson } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => coursesApi.getLessonById(lessonId),
    enabled: !!lessonId,
  });

  // Progreso visual de la lección
  const progressPercentage =
    exercises.length > 0
      ? Math.round((currentExerciseIndex / exercises.length) * 100)
      : 0;

  // Cola de achievements — muestra uno a la vez
  useEffect(() => {
    if (achievementQueue.length > 0 && !showAchievement) {
      setCurrentAchievement(achievementQueue[0]);
      setShowAchievement(true);
      setAchievementQueue((prev) => prev.slice(1));
    }
  }, [achievementQueue, showAchievement]);

  const handleSubmitAnswer = (answer: string, usedHints: boolean) => {
    if (!currentExercise) return;

    completeExercise({
      answer,
      exerciseId: currentExercise.id,
      lessonId,
      usedHints,
    });
  };

  // Cuando llega un resultado — mostrar animaciones
  useEffect(() => {
    if (!lastResult) return;

    if (lastResult.isCorrect && lastResult.xpEarned > 0) {
      setXpAmount(lastResult.xpEarned);
      setShowXpAnimation(true);
    }

    if (lastResult.newAchievements?.length > 0) {
      setAchievementQueue((prev) => [...prev, ...lastResult.newAchievements]);
    }
  }, [lastResult]);

  const handleNext = () => {
    const { nextExercise } = useLessonStore.getState();
    nextExercise();
  };

  const handleExit = () => {
    router.push("/learn");
  };

  if (isLoading) return <LoadingScreen />;

  // ── Pantalla de resultado final ──────────────────────────
  if (status === "completed" || status === "failed") {
    return (
      <LessonResultScreen
        status={status}
        xpEarned={xpEarned}
        correctAnswers={correctAnswers}
        totalExercises={exercises.length}
        onContinue={() => router.push("/learn")}
        onRetry={() => {
          useLessonStore.getState().resetLesson();
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Header de la lección */}
      <div className="sticky top-0 z-30 bg-game-bg/90 backdrop-blur-xl border-b border-game-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Botón salir */}
          <button
            onClick={handleExit}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>

          {/* Barra de progreso */}
          <div className="flex-1">
            <ProgressBar
              value={progressPercentage}
              variant="primary"
              size="sm"
              animated
            />
          </div>

          {/* Vidas */}
          <LivesDisplay lives={lives} compact />
        </div>
      </div>

      {/* Contenido del ejercicio */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {currentExercise && (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ExerciseWrapper
                exercise={currentExercise}
                lessonTitle={lesson?.title}
                onSubmit={handleSubmitAnswer}
                onNext={handleNext}
                result={lastResult}
                isSubmitting={isSubmitting}
                exerciseNumber={currentExerciseIndex + 1}
                totalExercises={exercises.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animación XP */}
      <XPAnimation
        amount={xpAmount}
        isVisible={showXpAnimation}
        onComplete={() => setShowXpAnimation(false)}
      />

      {/* Toast de logro */}
      <AchievementToast
        achievement={currentAchievement}
        isVisible={showAchievement}
        onClose={() => setShowAchievement(false)}
      />
    </div>
  );
}

// ── Pantalla de resultado final ──────────────────────────────
interface LessonResultScreenProps {
  status: "completed" | "failed";
  xpEarned: number;
  correctAnswers: number;
  totalExercises: number;
  onContinue: () => void;
  onRetry: () => void;
}

const LessonResultScreen = ({
  status,
  xpEarned,
  correctAnswers,
  totalExercises,
  onContinue,
  onRetry,
}: LessonResultScreenProps) => {
  const isSuccess = status === "completed";
  const accuracy = Math.round((correctAnswers / totalExercises) * 100);

  return (
    <motion.div
      className="min-h-screen bg-game-bg flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-md w-full text-center">
        {/* Emoji resultado */}
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
        >
          {isSuccess ? "🎉" : "💔"}
        </motion.div>

        {/* Título */}
        <motion.h1
          className={clsx(
            "text-3xl font-black mb-2",
            isSuccess ? "text-success-neon" : "text-danger",
          )}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isSuccess ? "¡Lección completada!" : "¡Sin vidas!"}
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isSuccess
            ? "¡Excelente trabajo! Sigue así 💪"
            : "No te rindas, ¡inténtalo de nuevo!"}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {[
            { label: "XP Ganado", value: `+${xpEarned}`, color: "text-xp" },
            {
              label: "Precisión",
              value: `${accuracy}%`,
              color: "text-primary-400",
            },
            {
              label: "Correctas",
              value: `${correctAnswers}/${totalExercises}`,
              color: "text-success-neon",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-game-surface border border-game-border rounded-2xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <p className={clsx("text-xl font-black", stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Botones */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          {isSuccess ? (
            <Button
              variant="success"
              fullWidth
              size="lg"
              onClick={onContinue}
              rightIcon={<ChevronRight size={18} />}
            >
              Continuar aprendiendo
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={onRetry}
                leftIcon={<RotateCcw size={16} />}
              >
                Intentar de nuevo
              </Button>
              <Button variant="ghost" fullWidth onClick={onContinue}>
                Volver al mapa
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
