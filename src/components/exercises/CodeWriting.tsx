"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

// Monaco Editor — carga dinámica para evitar SSR issues
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-game-card rounded-xl flex items-center justify-center">
        <Loader2 size={20} className="text-primary-400 animate-spin" />
      </div>
    ),
  },
);

interface CodeWritingProps {
  exercise: Exercise;
  answer: string;
  onChange: (value: string) => void;
  result: ExerciseResult | null;
}

export const CodeWriting = ({
  exercise,
  answer,
  onChange,
  result,
}: CodeWritingProps) => {
  const initialCode = exercise.starterCode || `// Escribe tu solución aquí\n`;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-300">
          Escribe tu solución
        </p>
        <span className="text-xs text-gray-600 font-mono px-2 py-0.5 bg-game-card rounded-lg border border-game-border">
          {exercise.language}
        </span>
      </div>

      {/* Editor */}
      <div
        className={clsx(
          "rounded-2xl overflow-hidden border-2 transition-all duration-200",
          !result
            ? "border-game-border"
            : result.isCorrect
              ? "border-success/50 shadow-glow-success"
              : "border-danger/50  shadow-glow-danger",
        )}
      >
        {/* Barra de editor */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-game-surface border-b border-game-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger/60" />
            <div className="w-3 h-3 rounded-full bg-xp/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-gray-600 font-mono ml-2">
            solution.{exercise.language === "python" ? "py" : "js"}
          </span>
        </div>

        {/* Monaco */}
        <MonacoEditor
          height="220px"
          language={exercise.language || "javascript"}
          value={answer || initialCode}
          onChange={(val) => onChange(val ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            readOnly: !!result,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};
