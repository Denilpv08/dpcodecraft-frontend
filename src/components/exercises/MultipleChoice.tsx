"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

interface MultipleChoiceProps {
  exercise: Exercise;
  answer: string;
  onChange: (value: string) => void;
  result: ExerciseResult | null;
}

export const MultipleChoice = ({
  exercise,
  answer,
  onChange,
  result,
}: MultipleChoiceProps) => {
  const options = exercise.options ?? [];

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option, i) => {
        const isSelected = answer === option.id;
        const isCorrect = result?.isCorrect && isSelected;
        const isWrong = !result?.isCorrect && isSelected && !!result;
        const isTheAnswer =
          !!result && !result.isCorrect && result.correctAnswer === option.id;

        return (
          <motion.button
            key={option.id}
            onClick={() => !result && onChange(option.id)}
            className={clsx(
              "relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden",
              // Sin resultado — estado de selección
              !result &&
                !isSelected &&
                "border-game-border bg-game-surface hover:border-primary-500/40 hover:bg-primary-500/5",
              !result &&
                isSelected &&
                "border-primary-500/60 bg-primary-500/10 shadow-glow-primary",
              // Con resultado
              isCorrect &&
                "border-success/60  bg-success/10  shadow-glow-success",
              isWrong &&
                "border-danger/60   bg-danger/10   shadow-glow-danger animate-shake",
              isTheAnswer && "border-success/40  bg-success/5",
              !isSelected &&
                !!result &&
                !isTheAnswer &&
                "border-game-border bg-game-surface opacity-50",
            )}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={!result ? { scale: 1.01 } : {}}
            whileTap={!result ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center gap-3">
              {/* Letra de opción */}
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200",
                  !result && !isSelected && "bg-game-card    text-gray-400",
                  !result && isSelected && "bg-primary-500  text-white",
                  isCorrect && "bg-success       text-white",
                  isWrong && "bg-danger        text-white",
                  isTheAnswer && "bg-success/30    text-success-neon",
                )}
              >
                {option.id.toUpperCase()}
              </div>

              {/* Texto */}
              <span
                className={clsx(
                  "text-sm font-medium flex-1",
                  !result && "text-gray-200",
                  isCorrect && "text-success-neon",
                  isWrong && "text-danger",
                  isTheAnswer && "text-success-neon",
                  !isSelected && !!result && !isTheAnswer && "text-gray-500",
                )}
              >
                {option.text}
              </span>

              {/* Ícono de resultado */}
              {isCorrect && (
                <CheckCircle2
                  size={18}
                  className="text-success-neon shrink-0"
                />
              )}
              {isWrong && (
                <XCircle size={18} className="text-danger shrink-0" />
              )}
              {isTheAnswer && (
                <CheckCircle2
                  size={18}
                  className="text-success-neon shrink-0"
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
