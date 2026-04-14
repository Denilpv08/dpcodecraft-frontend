"use client";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-game-bg flex flex-col items-center justify-center z-50">
      {/* Logo animado */}
      <motion.div
        className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary mb-6"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Code2 size={32} className="text-white" />
      </motion.div>

      {/* Nombre */}
      <motion.h1
        className="text-2xl font-black tracking-tight mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-gradient-primary">DPCode</span>
        <span className="text-white">Craft</span>
      </motion.h1>

      {/* Dots loader */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
};
