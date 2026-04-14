"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Code2, Zap } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { coursesApi } from "@/lib/api/courses.api";
import { usersApi } from "@/lib/api/users.api";
import { useUserStore } from "@/store/user.store";
import { DifficultyLevel } from "@/types/course.types";
import { clsx } from "clsx";
import toast from "react-hot-toast";

type Step = "category" | "language" | "level";

const STEPS: Step[] = ["category", "language", "level"];

const STEP_INFO = {
  category: {
    title: "¿Qué quieres aprender?",
    subtitle: "Elige tu área de enfoque",
  },
  language: {
    title: "¿Con qué lenguaje empiezas?",
    subtitle: "Selecciona tu primer lenguaje",
  },
  level: {
    title: "¿Cuál es tu nivel?",
    subtitle: "Sé honesto, ¡aquí no hay juicios!",
  },
};

const LEVELS = [
  {
    value: DifficultyLevel.BEGINNER,
    label: "Principiante",
    description: "Nunca he programado o estoy en mis primeros pasos",
    icon: "🌱",
    color: "from-success to-success-neon",
    border: "border-success/40",
    glow: "shadow-glow-success",
  },
  {
    value: DifficultyLevel.INTERMEDIATE,
    label: "Intermedio",
    description: "Conozco los básicos y quiero profundizar",
    icon: "🔥",
    color: "from-primary-500 to-primary-300",
    border: "border-primary-500/40",
    glow: "shadow-glow-primary",
  },
  {
    value: DifficultyLevel.ADVANCED,
    label: "Avanzado",
    description: "Tengo experiencia y busco dominar temas complejos",
    icon: "💎",
    color: "from-purple-500 to-pink-400",
    border: "border-purple-500/40",
    glow: "0 0 20px rgba(139,92,246,0.4)",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(
    null,
  );

  const stepIndex = STEPS.indexOf(currentStep);

  // Fetch categorías
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => coursesApi.getCategories(),
  });

  // Fetch lenguajes según categoría seleccionada
  const { data: languages = [], isLoading: languagesLoading } = useQuery({
    queryKey: ["languages", selectedCategory],
    queryFn: () => coursesApi.getLanguagesByCategory(selectedCategory!),
    enabled: !!selectedCategory,
  });

  // Guardar preferencias
  const saveMutation = useMutation({
    mutationFn: () =>
      usersApi.updateMe({
        selectedCategoryId: selectedCategory!,
        selectedLanguageId: selectedLanguage!,
        level:
          selectedLevel! as unknown as import("@/types/user.types").UserLevel,
      }),
    onSuccess: (user) => {
      setUser(user);
      toast.success("¡Perfecto! Vamos a aprender 🚀");
      router.replace("/dashboard");
    },
    onError: () => toast.error("Error al guardar preferencias"),
  });

  const canAdvance = () => {
    if (currentStep === "category") return !!selectedCategory;
    if (currentStep === "language") return !!selectedLanguage;
    if (currentStep === "level") return !!selectedLevel;
    return false;
  };

  const handleNext = () => {
    if (currentStep === "level") {
      saveMutation.mutate();
      return;
    }
    const nextIndex = stepIndex + 1;
    setCurrentStep(STEPS[nextIndex]);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setCurrentStep(STEPS[stepIndex - 1]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary">
          <Code2 size={20} className="text-white" />
        </div>
        <span className="font-black text-xl">
          <span className="text-gradient-primary">DPCode</span>
          <span className="text-white">Craft</span>
        </span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                i < stepIndex
                  ? "bg-success border-success text-white"
                  : i === stepIndex
                    ? "bg-primary-500 border-primary-400 text-white shadow-glow-primary"
                    : "bg-transparent border-game-border text-gray-600",
              )}
              animate={{ scale: i === stepIndex ? 1.1 : 1 }}
            >
              {i < stepIndex ? <Check size={14} /> : i + 1}
            </motion.div>

            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  "w-12 h-0.5 rounded-full transition-all duration-500",
                  i < stepIndex ? "bg-success" : "bg-game-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenido del paso */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Header del paso */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">
                {STEP_INFO[currentStep].title}
              </h1>
              <p className="text-gray-400">{STEP_INFO[currentStep].subtitle}</p>
            </div>

            {/* ── STEP: CATEGORY ──────────────────────────────── */}
            {currentStep === "category" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesLoading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-32 bg-game-surface rounded-2xl animate-pulse"
                      />
                    ))
                  : categories.map((cat, i) => (
                      <motion.button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedLanguage(null);
                        }}
                        className={clsx(
                          "relative p-6 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden",
                          selectedCategory === cat.id
                            ? "border-primary-500/60 bg-primary-500/10 shadow-glow-primary"
                            : "border-game-border bg-game-surface hover:border-game-hover",
                        )}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Color accent */}
                        <div
                          className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                          style={{ backgroundColor: cat.color }}
                        />

                        {/* Check */}
                        {selectedCategory === cat.id && (
                          <motion.div
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}

                        <p className="text-2xl mb-2">
                          {cat.slug === "frontend" ? "🎨" : "⚙️"}
                        </p>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {cat.description}
                        </p>
                      </motion.button>
                    ))}
              </div>
            )}

            {/* ── STEP: LANGUAGE ──────────────────────────────── */}
            {currentStep === "language" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languagesLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-28 bg-game-surface rounded-2xl animate-pulse"
                      />
                    ))
                  : languages.map((lang, i) => (
                      <motion.button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={clsx(
                          "relative p-4 rounded-2xl border-2 text-center transition-all duration-200 overflow-hidden",
                          selectedLanguage === lang.id
                            ? "border-primary-500/60 bg-primary-500/10 shadow-glow-primary"
                            : "border-game-border bg-game-surface hover:border-game-hover",
                        )}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* Color accent lateral */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                          style={{ backgroundColor: lang.color }}
                        />

                        {selectedLanguage === lang.id && (
                          <motion.div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check size={10} className="text-white" />
                          </motion.div>
                        )}

                        <div
                          className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center font-bold text-lg"
                          style={{
                            backgroundColor: `${lang.color}22`,
                            color: lang.color,
                          }}
                        >
                          {lang.name.charAt(0)}
                        </div>

                        <p className="text-sm font-bold text-white">
                          {lang.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {lang.totalCourses} cursos
                        </p>
                      </motion.button>
                    ))}
              </div>
            )}

            {/* ── STEP: LEVEL ─────────────────────────────────── */}
            {currentStep === "level" && (
              <div className="flex flex-col gap-3">
                {LEVELS.map((lvl, i) => (
                  <motion.button
                    key={lvl.value}
                    onClick={() => setSelectedLevel(lvl.value)}
                    className={clsx(
                      "relative p-5 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden",
                      selectedLevel === lvl.value
                        ? `${lvl.border} bg-linear-to-r ${lvl.color} bg-opacity-10`
                        : "border-game-border bg-game-surface hover:border-game-hover",
                    )}
                    style={
                      selectedLevel === lvl.value ? { boxShadow: lvl.glow } : {}
                    }
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedLevel === lvl.value && (
                      <motion.div
                        className="absolute inset-0 opacity-10 bg-linear-to-r pointer-events-none"
                        style={{
                          backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                      />
                    )}

                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{lvl.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {lvl.label}
                          </h3>
                          {selectedLevel === lvl.value && (
                            <motion.div
                              className="w-5 h-5 rounded-full bg-success flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check size={10} className="text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {lvl.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={stepIndex === 0}
            leftIcon={<ChevronLeft size={16} />}
          >
            Atrás
          </Button>

          <Button
            variant={currentStep === "level" ? "success" : "primary"}
            onClick={handleNext}
            disabled={!canAdvance()}
            isLoading={saveMutation.isPending}
            rightIcon={
              currentStep !== "level" ? <ChevronRight size={16} /> : undefined
            }
            size="lg"
          >
            {currentStep === "level" ? "¡Empezar a aprender! 🚀" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
