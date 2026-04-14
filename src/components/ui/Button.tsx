"use client";
import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "ghost"
  | "xp";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-primary-500 to-primary-600
    hover:from-primary-400 hover:to-primary-500
    text-white shadow-glow-primary
    border border-primary-400/30
  `,
  secondary: `
    bg-game-surface hover:bg-game-hover
    text-white border border-game-border
    hover:border-primary-500/50
  `,
  success: `
    bg-gradient-to-r from-success to-success-neon
    hover:from-success-dark hover:to-success
    text-white shadow-glow-success
    border border-success/30
  `,
  danger: `
    bg-gradient-to-r from-danger to-danger-dark
    hover:from-danger-dark hover:to-red-700
    text-white shadow-glow-danger
    border border-danger/30
  `,
  ghost: `
    bg-transparent hover:bg-white/5
    text-gray-300 hover:text-white
    border border-white/10 hover:border-white/20
  `,
  xp: `
    bg-gradient-to-r from-xp to-xp-glow
    hover:from-xp-dark hover:to-xp
    text-game-bg font-bold shadow-glow-xp
    border border-xp/30
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg  gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl  gap-2",
  lg: "px-7 py-3   text-base rounded-xl gap-2.5",
  xl: "px-9 py-4   text-lg  rounded-2xl gap-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.96 }}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        className={clsx(
          // Base
          "relative inline-flex items-center justify-center",
          "font-semibold tracking-wide",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          "select-none cursor-pointer",
          // Variant
          variants[variant],
          // Size
          sizes[size],
          // Full width
          fullWidth && "w-full",
          // Disabled
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {/* Shimmer effect en hover */}
        <span
          className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
          aria-hidden
        >
          <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </span>

        {/* Loading spinner */}
        {isLoading && (
          <motion.span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {/* Content */}
        <span>{children}</span>

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
