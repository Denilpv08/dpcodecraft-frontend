"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { clsx } from "clsx";

interface LivesDisplayProps {
  lives: number;
  maxLives?: number;
  compact?: boolean;
  animated?: boolean;
  className?: string;
}

export const LivesDisplay = ({
  lives,
  maxLives = 5,
  compact = false,
  animated = true,
  className,
}: LivesDisplayProps) => {
  const hearts = Array.from({ length: maxLives }, (_, i) => i < lives);

  if (compact) {
    return (
      <div className={clsx("flex items-center gap-1", className)}>
        <Heart size={14} className="text-danger fill-danger" />
        <span className="text-sm font-bold text-danger">{lives}</span>
      </div>
    );
  }

  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <AnimatePresence mode="popLayout">
        {hearts.map((isAlive, index) => (
          <motion.div
            key={index}
            initial={animated ? { scale: 0, rotate: -20 } : undefined}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: index * 0.05,
            }}
          >
            <Heart
              size={22}
              className={clsx(
                "transition-all duration-300",
                isAlive
                  ? "text-danger fill-danger drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]"
                  : "text-gray-700 fill-gray-700",
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Alerta de vidas bajas */}
      {lives === 1 && (
        <motion.span
          className="text-xs text-danger font-bold ml-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ¡Última vida!
        </motion.span>
      )}

      {lives === 0 && (
        <motion.span
          className="text-xs text-gray-500 font-bold ml-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Sin vidas
        </motion.span>
      )}
    </div>
  );
};
