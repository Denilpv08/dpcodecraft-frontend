import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios — estilo videojuego vibrante
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Principal
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // XP y progreso — amarillo/dorado
        xp: {
          light: "#FEF3C7",
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          glow: "#FCD34D",
        },
        // Éxito — verde neón
        success: {
          light: "#D1FAE5",
          DEFAULT: "#10B981",
          dark: "#059669",
          neon: "#34D399",
        },
        // Error — rojo vibrante
        danger: {
          light: "#FEE2E2",
          DEFAULT: "#EF4444",
          dark: "#DC2626",
        },
        // Racha — naranja fuego
        streak: {
          light: "#FED7AA",
          DEFAULT: "#F97316",
          dark: "#EA580C",
          fire: "#FB923C",
        },
        // Fondo oscuro tipo videojuego
        game: {
          bg: "#0F0F1A", // Fondo principal
          surface: "#1A1A2E", // Cards
          card: "#16213E", // Cards secundarias
          border: "#0F3460", // Bordes
          hover: "#1F2937", // Hover states
        },
        // Niveles
        level: {
          beginner: "#10B981", // Verde
          intermediate: "#3B82F6", // Azul
          advanced: "#8B5CF6", // Morado
          master: "#F59E0B", // Dorado
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "Fira Code", "monospace"],
        game: ["var(--font-orbitron)", "sans-serif"], // Para títulos estilo gaming
      },

      animation: {
        "xp-bounce": "xpBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97)",
        "level-up": "levelUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        float: "float 3s ease-in-out infinite",
        "streak-fire": "streakFire 1s ease-in-out infinite alternate",
      },

      keyframes: {
        xpBounce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.4)" },
          "100%": { transform: "scale(1)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(14, 165, 233, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.9)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-3px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(3px, 0, 0)" },
        },
        levelUp: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        streakFire: {
          "0%": { filter: "hue-rotate(0deg) brightness(1)" },
          "100%": { filter: "hue-rotate(30deg) brightness(1.3)" },
        },
      },

      boxShadow: {
        "glow-primary": "0 0 20px rgba(14, 165, 233, 0.4)",
        "glow-xp": "0 0 20px rgba(245, 158, 11, 0.4)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.4)",
        "glow-danger": "0 0 20px rgba(239, 68, 68, 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.6)",
      },

      backgroundImage: {
        "gradient-game": "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)",
        "gradient-primary": "linear-gradient(135deg, #0ea5e9 0%, #8B5CF6 100%)",
        "gradient-xp": "linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)",
        "gradient-success": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
        "gradient-streak": "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
