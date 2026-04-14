"use client";
import { HTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

type CardVariant = "default" | "hover" | "glow" | "flat";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  animate?: boolean;
}

const variants: Record<CardVariant, string> = {
  default: "bg-game-surface border border-game-border",
  hover:
    "bg-game-surface border border-game-border hover:border-primary-500/50 hover:shadow-glow-primary cursor-pointer",
  glow: "bg-game-surface border border-primary-500/40 shadow-glow-primary",
  flat: "bg-game-card border border-white/5",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      animate = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={animate ? { opacity: 0, y: 16 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={clsx(
          "rounded-2xl shadow-card transition-all duration-200",
          variants[variant],
          paddings[padding],
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

// Sub-componentes para composición
export const CardHeader = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("mb-4", className)}>{children}</div>
);

export const CardTitle = ({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={clsx("text-lg font-bold text-white tracking-tight", className)}
  >
    {children}
  </h3>
);

export const CardBody = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("text-gray-300", className)}>{children}</div>
);

export const CardFooter = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "mt-4 pt-4 border-t border-game-border flex items-center gap-3",
      className,
    )}
  >
    {children}
  </div>
);
