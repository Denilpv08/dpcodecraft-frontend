"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Zap } from "lucide-react";
import { Achievement } from "@/types/exercise.types";

interface AchievementToastProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

export const AchievementToast = ({
  achievement,
  isVisible,
  onClose,
}: AchievementToastProps) => {
  // Auto-cerrar después de 5 segundos
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          className="fixed top-6 left-1/2 z-100 pointer-events-auto"
          style={{ x: "-50%" }}
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <div className="relative bg-game-surface border border-xp/40 rounded-2xl px-5 py-4 shadow-glow-xp min-w-75 max-w-sm overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-linear-to-r from-xp/5 to-transparent pointer-events-none" />

            {/* Barra de progreso de auto-cierre */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-linear-to-br from-xp to-xp-glow"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />

            <div className="relative flex items-start gap-3">
              {/* Ícono */}
              <motion.div
                className="w-12 h-12 rounded-xl bg-linear-to-br from-xp to-xp-glow flex items-center justify-center shrink-0 shadow-glow-xp"
                animate={{
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Trophy
                  size={24}
                  className="text-game-bg"
                  fill="currentColor"
                />
              </motion.div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-xp font-bold uppercase tracking-widest mb-0.5">
                  ¡Logro desbloqueado!
                </p>
                <p className="text-white font-bold text-sm leading-tight">
                  {achievement.title}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                  {achievement.description}
                </p>

                {/* XP del logro */}
                {achievement.xpReward > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Zap size={12} className="text-xp fill-xp" />
                    <span className="text-xs font-bold text-xp">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                )}
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-0.5 rounded shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
