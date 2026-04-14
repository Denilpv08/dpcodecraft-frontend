"use client";
import { HTMLAttributes } from "react";
import { clsx } from "clsx";

type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "xp"
  | "streak"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "ghost";

type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean; // Punto de estado
  pulse?: boolean; // Animación de pulso
  icon?: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-500/15 text-primary-300  border-primary-500/30",
  success: "bg-success/15      text-success-neon border-success/30",
  danger: "bg-danger/15       text-red-300      border-danger/30",
  warning: "bg-xp/15           text-xp-glow      border-xp/30",
  xp: "bg-xp/20           text-xp           border-xp/40",
  streak: "bg-streak/15       text-streak-fire  border-streak/30",
  beginner: "bg-success/15      text-success-neon border-success/30",
  intermediate: "bg-primary-500/15  text-primary-300  border-primary-500/30",
  advanced: "bg-purple-500/15   text-purple-300   border-purple-500/30",
  ghost: "bg-white/5         text-gray-400     border-white/10",
};

const sizes: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[10px] rounded-md gap-1",
  sm: "px-2   py-0.5 text-xs     rounded-lg gap-1",
  md: "px-2.5 py-1   text-sm     rounded-lg gap-1.5",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-primary-400",
  success: "bg-success-neon",
  danger: "bg-red-400",
  warning: "bg-xp-glow",
  xp: "bg-xp",
  streak: "bg-streak-fire",
  beginner: "bg-success-neon",
  intermediate: "bg-primary-400",
  advanced: "bg-purple-400",
  ghost: "bg-gray-400",
};

export const Badge = ({
  variant = "primary",
  size = "sm",
  dot = false,
  pulse = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold border tracking-wide",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {/* Dot de estado */}
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={clsx(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant],
              )}
            />
          )}
          <span
            className={clsx(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              dotColors[variant],
            )}
          />
        </span>
      )}

      {/* Ícono */}
      {icon && <span className="shrink-0">{icon}</span>}

      {children}
    </span>
  );
};
