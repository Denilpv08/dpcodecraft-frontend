"use client";
import { clsx } from "clsx";
import { Terminal } from "lucide-react";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

interface OutputPredictionProps {
  exercise: Exercise;
  answer: string;
  onChange: (value: string) => void;
  result: ExerciseResult | null;
}

export const OutputPrediction = ({
  exercise,
  answer,
  onChange,
  result,
}: OutputPredictionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Código a analizar */}
      {exercise.starterCode && (
        <div className="bg-game-card border border-game-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-game-border bg-game-surface">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/60" />
              <div className="w-3 h-3 rounded-full bg-xp/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-gray-600 font-mono ml-2">
              ¿Cuál es el output?
            </span>
          </div>
          <pre className="p-5 font-mono text-sm text-gray-200 overflow-x-auto leading-relaxed">
            {exercise.starterCode}
          </pre>
        </div>
      )}

      {/* Si tiene opciones — selección múltiple */}
      {exercise.options && exercise.options.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {exercise.options.map((opt) => {
            const isSelected = answer === opt.id;
            const isCorrect = result?.isCorrect && isSelected;
            const isWrong = !result?.isCorrect && isSelected && !!result;
            const isTheAnswer =
              !!result && !result.isCorrect && result.correctAnswer === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => !result && onChange(opt.id)}
                className={clsx(
                  "p-4 rounded-2xl border-2 font-mono text-sm text-left transition-all duration-200",
                  !result &&
                    !isSelected &&
                    "border-game-border bg-game-surface hover:border-primary-500/40",
                  !result &&
                    isSelected &&
                    "border-primary-500/60 bg-primary-500/10",
                  isCorrect && "border-success/60  bg-success/10",
                  isWrong && "border-danger/60   bg-danger/10  animate-shake",
                  isTheAnswer && "border-success/40  bg-success/5",
                )}
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-gray-500 shrink-0" />
                  <code
                    className={clsx(
                      isCorrect && "text-success-neon",
                      isWrong && "text-danger",
                      isTheAnswer && "text-success-neon",
                      !isCorrect && !isWrong && !isTheAnswer && "text-gray-200",
                    )}
                  >
                    {opt.text}
                  </code>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Input libre si no hay opciones */
        <div className="relative">
          <Terminal
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe el output esperado..."
            disabled={!!result}
            className={clsx(
              "w-full font-mono text-sm pl-10 pr-4 py-3",
              "bg-game-card border-2 rounded-xl outline-none",
              "transition-all duration-200",
              !result
                ? "border-game-border text-gray-200 placeholder:text-gray-600 focus:border-primary-500/60"
                : result.isCorrect
                  ? "border-success/60 text-success-neon"
                  : "border-danger/60  text-danger",
            )}
          />
        </div>
      )}
    </div>
  );
};
