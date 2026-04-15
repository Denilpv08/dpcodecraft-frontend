"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Debugging } from "./Debugging";
import { Exercise, ExerciseResult, ExerciseType } from "@/types/exercise.types";
import { MultipleChoice } from "./MultipleChoice";
import { CodeCompletion } from "./CodeCompletion";
import { OutputPrediction } from "./OutputPrediction";
import { CodeWriting } from "./CodeWriting";

interface ExerciseWrapperProps {
  exercise: Exercise;
  lessonTitle?: string;
  onSubmit: (answer: string, usedHints: boolean) => void;
  onNext: () => void;
  result: ExerciseResult | null;
  isSubmitting: boolean;
  exerciseNumber: number;
  totalExercises: number;
}

export const ExerciseWrapper = ({
  exercise,
  lessonTitle,
  onSubmit,
  onNext,
  result,
  isSubmitting,
  exerciseNumber,
  totalExercises,
}: ExerciseWrapperProps) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [usedHints, setUsedHints] = useState(false);
  const [answer, setAnswer] = useState("");

  const hasResult = !!result;
  const hints = exercise.hints ?? [];
  const hasHints = hints.length > 0;

  const handleShowHint = () => {
    const nextIndex = currentHintIndex + 1;
    if (nextIndex < hints.length) {
      setCurrentHintIndex(nextIndex);
      setUsedHints(true);
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer, usedHints);
  };

  const handleNext = () => {
    setAnswer("");
    setCurrentHintIndex(-1);
    setUsedHints(false);
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header del ejercicio */}
      <div className="flex items-center justify-between">
        <div>
          {lessonTitle && (
            <p className="text-xs text-gray-500 mb-1">{lessonTitle}</p>
          )}
          <div className="flex items-center gap-2">
            <Badge
              variant={
                exercise.difficulty === "easy"
                  ? "success"
                  : exercise.difficulty === "medium"
                    ? "warning"
                    : "danger"
              }
              size="xs"
            >
              {exercise.difficulty === "easy"
                ? "Fácil"
                : exercise.difficulty === "medium"
                  ? "Medio"
                  : "Difícil"}
            </Badge>
            <span className="text-xs text-gray-600">
              {exerciseNumber} / {totalExercises}
            </span>
          </div>
        </div>

        {/* Hint button */}
        {hasHints && !hasResult && currentHintIndex < hints.length - 1 && (
          <button
            onClick={handleShowHint}
            className="flex items-center gap-1.5 text-xs text-xp hover:text-xp-glow transition-colors px-3 py-1.5 rounded-lg border border-xp/20 hover:border-xp/40 bg-xp/5"
          >
            <Lightbulb size={13} />
            Pista {currentHintIndex + 2}/{hints.length}
          </button>
        )}
      </div>

      {/* Instrucciones */}
      <div className="bg-game-surface border border-game-border rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white mb-2">{exercise.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          {exercise.instructions}
        </p>
      </div>

      {/* Hints mostradas */}
      <AnimatePresence>
        {currentHintIndex >= 0 && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {hints.slice(0, currentHintIndex + 1).map((hint, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 bg-xp/5 border border-xp/20 rounded-xl p-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Lightbulb size={14} className="text-xp shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300">{hint}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Componente de ejercicio según tipo */}
      <div className={clsx(hasResult && "pointer-events-none")}>
        {exercise.type === ExerciseType.MULTIPLE_CHOICE && (
          <MultipleChoice
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
        {exercise.type === ExerciseType.CODE_COMPLETION && (
          <CodeCompletion
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
        {exercise.type === ExerciseType.OUTPUT_PREDICTION && (
          <OutputPrediction
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
        {exercise.type === ExerciseType.CODE_WRITING && (
          <CodeWriting
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
        {exercise.type === ExerciseType.DEBUGGING && (
          <Debugging
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
        {exercise.type === ExerciseType.ORDERING && (
          <MultipleChoice
            exercise={exercise}
            answer={answer}
            onChange={setAnswer}
            result={result}
          />
        )}
      </div>

      {/* Feedback de resultado */}
      <AnimatePresence>
        {hasResult && (
          <motion.div
            className={clsx(
              "rounded-2xl p-4 border",
              result.isCorrect
                ? "bg-success/10 border-success/30"
                : "bg-danger/10  border-danger/30",
            )}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            <div className="flex items-start gap-3">
              {result.isCorrect ? (
                <CheckCircle2
                  size={20}
                  className="text-success-neon shrink-0 mt-0.5"
                />
              ) : (
                <XCircle size={20} className="text-danger shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={clsx(
                    "font-bold text-sm mb-1",
                    result.isCorrect ? "text-success-neon" : "text-danger",
                  )}
                >
                  {result.isCorrect ? "¡Correcto! 🎉" : "Incorrecto"}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {result.explanation}
                </p>
                {!result.isCorrect && result.correctAnswer && (
                  <div className="mt-2 p-2 bg-game-bg rounded-lg">
                    <p className="text-[11px] text-gray-500 mb-1">
                      Respuesta correcta:
                    </p>
                    <code className="text-xs text-success-neon font-mono">
                      {result.correctAnswer}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {!hasResult ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!answer.trim()}
            isLoading={isSubmitting}
            fullWidth
          >
            Comprobar respuesta
          </Button>
        ) : (
          <Button
            variant={result?.isCorrect ? "success" : "primary"}
            size="lg"
            onClick={handleNext}
            rightIcon={<ChevronRight size={18} />}
            fullWidth
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
};
