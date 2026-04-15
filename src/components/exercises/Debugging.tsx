"use client";
import dynamic from "next/dynamic";
import { Bug, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { Exercise, ExerciseResult } from "@/types/exercise.types";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-52 bg-game-card rounded-xl flex items-center justify-center">
        <Loader2 size={20} className="text-primary-400 animate-spin" />
      </div>
    ),
  },
);

interface DebuggingProps {
  exercise: Exercise;
  answer: string;
  onChange: (value: string) => void;
  result: ExerciseResult | null;
}

export const Debugging = ({
  exercise,
  answer,
  onChange,
  result,
}: DebuggingProps) => {
  const buggyCode = exercise.starterCode || "";

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
        <Bug size={16} className="text-danger" />
        Encuentra y corrige el error
      </div>

      {/* Editor con código buggy */}
      <div
        className={clsx(
          "rounded-2xl overflow-hidden border-2 transition-all duration-200",
          !result
            ? "border-danger/30"
            : result.isCorrect
              ? "border-success/50 shadow-glow-success"
              : "border-danger/50",
        )}
      >
        {/* Barra */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-game-surface border-b border-game-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/60" />
              <div className="w-3 h-3 rounded-full bg-xp/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-gray-600 font-mono ml-1">
              buggy_code.js
            </span>
          </div>
          <span className="text-[10px] text-danger/70 font-semibold px-2 py-0.5 bg-danger/10 rounded-md border border-danger/20">
            🐛 Bug detectado
          </span>
        </div>

        <MonacoEditor
          height="240px"
          language={exercise.language || "javascript"}
          value={answer || buggyCode}
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
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};
