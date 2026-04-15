"use client";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { UserLevel } from "@/types/user.types";
import { getLevelLabel } from "@/lib/utils/xp.utils";

interface LevelBadgeProps {
  level: UserLevel;
  size?: "sm" | "md" | "lg" | "xs";
  animated?: boolean;
  showIcon?: boolean;
  className?: string;
}

const levelConfig: Record<
  UserLevel,
  {
    gradient: string;
    border: string;
    glow: string;
    icon: string;
  }
> = {
  [UserLevel.BEGINNER]: {
    gradient: "from-success to-success-neon",
    border: "border-success/40",
    glow: "shadow-glow-success",
    icon: "⚡",
  },
  [UserLevel.INTERMEDIATE]: {
    gradient: "from-primary-500 to-primary-300",
    border: "border-primary-500/40",
    glow: "shadow-glow-primary",
    icon: "🔥",
  },
  [UserLevel.ADVANCED]: {
    gradient: "from-purple-500 to-pink-400",
    border: "border-purple-500/40",
    glow: "0 0 20px rgba(139,92,246,0.5)",
    icon: "💎",
  },
};

const sizes = {
  sm: { badge: "px-2 py-0.5 text-[10px] rounded-md gap-1", icon: "text-xs" },
  md: { badge: "px-3 py-1   text-xs     rounded-lg gap-1.5", icon: "text-sm" },
  lg: { badge: "px-4 py-1.5 text-sm     rounded-xl gap-2", icon: "text-base" },
  xs: { badge: "px-2 py-0.5 text-[10px] rounded-md gap-1", icon: "text-xs" },
};

export const LevelBadge = ({
  level,
  size = "md",
  animated = false,
  showIcon = true,
  className,
}: LevelBadgeProps) => {
  const config = levelConfig[level];
  const s = sizes[size];

  const badge = (
    <span
      className={clsx(
        "inline-flex items-center font-bold",
        "border bg-linear-to-r bg-clip-text text-transparent",
        config.border,
        config.glow,
        s.badge,
        // Fondo con gradiente sutil
        "relative overflow-hidden",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3))`,
      }}
    >
      {/* Gradiente de fondo */}
      <span
        className={clsx(
          "absolute inset-0 opacity-15 bg-linear-to-r",
          config.gradient,
        )}
      />

      {showIcon && (
        <span className={clsx("relative z-10", s.icon)}>{config.icon}</span>
      )}

      <span
        className={clsx(
          "relative z-10 bg-linear-to-r bg-clip-text text-transparent",
          config.gradient,
        )}
      >
        {getLevelLabel(level)}
      </span>
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
};
