"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { clsx } from "clsx";
import { UserLevel } from "@/types/user.types";
import {
  getXpProgress,
  getLevelLabel,
  getLevelColor,
  formatXp,
} from "@/lib/utils/xp.utils";

interface XPBarProps {
  xp: number;
  level: UserLevel;
  compact?: boolean; // Vista reducida para navbar
  showDetails?: boolean; // Muestra XP actual / XP requerido
  className?: string;
}

const levelGradients: Record<UserLevel, string> = {
  [UserLevel.BEGINNER]: "from-success     to-success-neon",
  [UserLevel.INTERMEDIATE]: "from-primary-500 to-primary-300",
  [UserLevel.ADVANCED]: "from-purple-500  to-pink-400",
};

const levelGlows: Record<UserLevel, string> = {
  [UserLevel.BEGINNER]: "shadow-glow-success",
  [UserLevel.INTERMEDIATE]: "shadow-glow-primary",
  [UserLevel.ADVANCED]: "0 0 20px rgba(139, 92, 246, 0.5)",
};

export const XPBar = ({
  xp,
  level,
  compact = false,
  showDetails = true,
  className,
}: XPBarProps) => {
  const { current, required, percentage } = getXpProgress(xp, level);
  const isMaxLevel = level === UserLevel.ADVANCED && percentage === 100;

  if (compact) {
    return (
      <div className={clsx("flex items-center gap-2", className)}>
        {/* Ícono XP */}
        <div className="flex items-center gap-1 text-xp">
          <Zap size={14} className="fill-xp" />
          <span className="text-xs font-bold">{formatXp(xp)}</span>
        </div>

        {/* Barra compacta */}
        <div className="w-20 h-1.5 bg-xp/10 rounded-full overflow-hidden">
          <motion.div
            className={clsx(
              "h-full rounded-full bg-linear-to-br",
              levelGradients[level],
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Ícono de nivel */}
          <div
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "bg-linear-to-br text-white font-bold text-xs",
              levelGradients[level],
            )}
          >
            {level === UserLevel.BEGINNER && "⚡"}
            {level === UserLevel.INTERMEDIATE && "🔥"}
            {level === UserLevel.ADVANCED && "💎"}
          </div>

          <div>
            <p className={clsx("text-sm font-bold", getLevelColor(level))}>
              {getLevelLabel(level)}
            </p>
            {showDetails && (
              <p className="text-[11px] text-gray-500">
                {isMaxLevel
                  ? "Nivel máximo"
                  : `${formatXp(current)} / ${formatXp(required)} XP`}
              </p>
            )}
          </div>
        </div>

        {/* XP total */}
        <div className="flex items-center gap-1 text-xp">
          <Zap size={16} className="fill-xp" />
          <span className="text-sm font-bold">{formatXp(xp)}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="relative h-3 bg-xp/10 rounded-full overflow-hidden border border-xp/5">
        <motion.div
          className={clsx(
            "h-full rounded-full relative overflow-hidden bg-linear-to-r",
            levelGradients[level],
            levelGlows[level],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Shine */}
          <div className="absolute inset-0 bg-linear-to-b from-white/25 to-transparent" />

          {/* Stripes animadas */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)",
              backgroundSize: "12px 12px",
            }}
            animate={{ backgroundPosition: ["0px 0px", "12px 12px"] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Pulso si está al 100% */}
        {percentage === 100 && (
          <motion.div
            className={clsx(
              "absolute inset-0 rounded-full bg-linear-to-r",
              levelGradients[level],
            )}
            animate={{ opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Porcentaje */}
      {showDetails && !isMaxLevel && (
        <p className="text-[11px] text-gray-600 text-right mt-1">
          {percentage}% hacia{" "}
          {getLevelLabel(
            level === UserLevel.BEGINNER
              ? UserLevel.INTERMEDIATE
              : UserLevel.ADVANCED,
          )}
        </p>
      )}
    </div>
  );
};
