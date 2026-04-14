"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { clsx } from "clsx";

interface StreakCounterProps {
  streak: number;
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

// Obtiene la intensidad visual según la racha
const getStreakIntensity = (streak: number) => {
  if (streak >= 30)
    return {
      color: "text-red-400",
      glow: "shadow-glow-danger",
      label: "¡Imparable!",
    };
  if (streak >= 14)
    return {
      color: "text-orange-400",
      glow: "shadow-[0_0_20px_rgba(251,146,60,0.5)]",
      label: "¡En llamas!",
    };
  if (streak >= 7)
    return {
      color: "text-streak-fire",
      glow: "0 0 16px rgba(249,115,22,0.4)",
      label: "¡Racha!",
    };
  if (streak >= 3) return { color: "text-streak", glow: "", label: "Activo" };
  return { color: "text-gray-500", glow: "", label: "Sin racha" };
};

export const StreakCounter = ({
  streak,
  compact = false,
  showLabel = true,
  className,
}: StreakCounterProps) => {
  const { color, glow, label } = getStreakIntensity(streak);
  const isActive = streak > 0;

  if (compact) {
    return (
      <div className={clsx("flex items-center gap-1.5", className)}>
        <motion.div
          animate={
            isActive
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [-5, 5, -5, 0],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Flame
            size={16}
            className={clsx(color, isActive && "animate-streak-fire")}
            fill={isActive ? "currentColor" : "none"}
          />
        </motion.div>
        <span className={clsx("text-sm font-bold", color)}>{streak}</span>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col items-center gap-1", className)}>
      {/* Ícono de llama con animación */}
      <div className="relative">
        <motion.div
          animate={
            isActive
              ? {
                  scale: [1, 1.15, 1],
                }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame
            size={32}
            className={clsx(
              "transition-all duration-300",
              color,
              glow,
              isActive && "animate-streak-fire",
            )}
            fill={isActive ? "currentColor" : "none"}
          />
        </motion.div>

        {/* Partículas de fuego para rachas altas */}
        {streak >= 7 && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={clsx(
                  "absolute w-1 h-1 rounded-full",
                  streak >= 30 ? "bg-red-400" : "bg-streak-fire",
                )}
                style={{
                  left: `${20 + i * 15}%`,
                  bottom: "80%",
                }}
                animate={{
                  y: [-4, -12, -4],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Número de racha */}
      <motion.span
        key={streak}
        className={clsx("text-2xl font-black tracking-tight", color)}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {streak}
      </motion.span>

      {/* Label */}
      {showLabel && (
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      )}
    </div>
  );
};
