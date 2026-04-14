"use client";
import { motion } from "framer-motion";
import { clsx } from "clsx";

type ProgressVariant = "primary" | "xp" | "success" | "streak" | "lives";

interface ProgressBarProps {
  value: number; // 0 - 100
  variant?: ProgressVariant;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const trackColors: Record<ProgressVariant, string> = {
  primary: "bg-primary-900/40",
  xp: "bg-xp/10",
  success: "bg-success/10",
  streak: "bg-streak/10",
  lives: "bg-danger/10",
};

const fillColors: Record<ProgressVariant, string> = {
  primary: "bg-gradient-to-r from-primary-500 to-primary-400",
  xp: "bg-gradient-to-r from-xp to-xp-glow",
  success: "bg-gradient-to-r from-success to-success-neon",
  streak: "bg-gradient-to-r from-streak to-streak-fire",
  lives: "bg-gradient-to-r from-danger to-red-400",
};

const glowColors: Record<ProgressVariant, string> = {
  primary: "shadow-glow-primary",
  xp: "shadow-glow-xp",
  success: "shadow-glow-success",
  streak: "0 0 8px rgba(249, 115, 22, 0.6)",
  lives: "shadow-glow-danger",
};

const heights = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export const ProgressBar = ({
  value,
  variant = "primary",
  size = "md",
  showLabel = false,
  label,
  animated = true,
  striped = false,
  className,
}: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx("w-full", className)}>
      {/* Label superior */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-medium text-gray-400">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-bold text-white ml-auto">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className={clsx(
          "relative w-full rounded-full overflow-hidden",
          trackColors[variant],
          heights[size],
        )}
      >
        {/* Fill */}
        <motion.div
          className={clsx(
            "h-full rounded-full relative overflow-hidden",
            fillColors[variant],
            glowColors[variant],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Stripes animadas */}
          {striped && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                backgroundSize: "12px 12px",
                animation: "moveStripes 1s linear infinite",
              }}
            />
          )}

          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent rounded-full" />
        </motion.div>

        {/* Pulso al llegar a 100% */}
        {clampedValue === 100 && (
          <motion.div
            className={clsx(
              "absolute inset-0 rounded-full",
              fillColors[variant],
            )}
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};
