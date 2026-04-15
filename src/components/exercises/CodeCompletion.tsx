"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { clsx } from "clsx";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

interface CodeCompletionProps {
  exercise: Exercise;
  answer: string;
  onChange: (value: string) => void;
  result: ExerciseResult | null;
}

export const CodeCompletion = ({
  exercise,
  answer,
  onChange,
  result,
}: CodeCompletionProps) => {
  const starterCode = exercise.starterCode ?? "";

  // Divide el starter code en partes por los blancos ___
  const parts = starterCode.split("___");
  const blankCount = parts.length - 1;

  const [blanks, setBlanks] = useState<string[]>(Array(blankCount).fill(""));

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    setBlanks(newBlanks);

    // Reconstruye el código completo
    let fullCode = "";
    parts.forEach((part, i) => {
      fullCode += part;
      if (i < blankCount) {
        fullCode += newBlanks[i] || "___";
      }
    });
    onChange(fullCode);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
        <Code2 size={16} className="text-primary-400" />
        Completa el código
      </div>

      {/* Código con blancos */}
      <div className="bg-game-card border border-game-border rounded-2xl overflow-hidden">
        {/* Barra de título estilo editor */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-game-border bg-game-surface">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger/60" />
            <div className="w-3 h-3 rounded-full bg-xp/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-gray-600 font-mono ml-2">
            {exercise.language}.js
          </span>
        </div>

        {/* Contenido del código */}
        <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
          {parts.map((part, i) => (
            <span key={i}>
              {/* Parte del código */}
              <span className="text-gray-200 whitespace-pre">{part}</span>

              {/* Blank input */}
              {i < blankCount && (
                <motion.input
                  type="text"
                  value={blanks[i]}
                  onChange={(e) => handleBlankChange(i, e.target.value)}
                  placeholder="____"
                  disabled={!!result}
                  className={clsx(
                    "inline-block font-mono text-sm text-center",
                    "border-b-2 bg-transparent outline-none",
                    "min-w-15 max-w-40 mx-1 px-2",
                    "transition-all duration-200",
                    !result
                      ? "border-primary-500/60 text-primary-300 placeholder:text-primary-500/40 focus:border-primary-400"
                      : result.isCorrect
                        ? "border-success/60 text-success-neon"
                        : "border-danger/60  text-danger",
                  )}
                  style={{ width: `${Math.max(blanks[i].length + 2, 6)}ch` }}
                  initial={{ scaleX: 0.8 }}
                  animate={{ scaleX: 1 }}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Código correcto si falló */}
      {result && !result.isCorrect && result.correctAnswer && (
        <motion.div
          className="bg-success/5 border border-success/20 rounded-xl p-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
            Solución correcta:
          </p>
          <code className="text-sm font-mono text-success-neon whitespace-pre-wrap">
            {result.correctAnswer}
          </code>
        </motion.div>
      )}
    </div>
  );
};
