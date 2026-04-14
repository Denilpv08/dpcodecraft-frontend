"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface XPAnimationProps {
  amount: number;
  isVisible: boolean;
  onComplete?: () => void;
  position?: "center" | "top-right";
}

export const XPAnimation = ({
  amount,
  isVisible,
  onComplete,
  position = "center",
}: XPAnimationProps) => {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && amount > 0 && (
        <motion.div
          className={`
            fixed z-50 pointer-events-none
            ${
              position === "center"
                ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                : "right-8 top-20"
            }
          `}
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1.2, y: -40 }}
          exit={{ opacity: 0, scale: 0.8, y: -80 }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <div className="flex items-center gap-2 bg-game-surface/90 backdrop-blur-sm border border-xp/40 rounded-2xl px-5 py-3 shadow-glow-xp">
            {/* Partículas */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-xp-glow"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60,
                }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
              />
            ))}

            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Zap size={22} className="text-xp fill-xp" />
            </motion.div>

            <motion.span
              className="text-2xl font-black text-xp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              +{amount} XP
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
