"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { UserLevel } from "@/types/user.types";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string | null;
  displayName: string;
  level?: UserLevel;
  size?: AvatarSize;
  showLevelRing?: boolean;
  showOnline?: boolean;
  animated?: boolean;
  className?: string;
}

const sizes: Record<
  AvatarSize,
  { container: string; text: string; ring: string; online: string }
> = {
  xs: {
    container: "w-7  h-7",
    text: "text-[10px]",
    ring: "ring-1 ring-offset-1",
    online: "w-1.5 h-1.5",
  },
  sm: {
    container: "w-9  h-9",
    text: "text-xs",
    ring: "ring-2 ring-offset-1",
    online: "w-2   h-2",
  },
  md: {
    container: "w-11 h-11",
    text: "text-sm",
    ring: "ring-2 ring-offset-2",
    online: "w-2.5 h-2.5",
  },
  lg: {
    container: "w-14 h-14",
    text: "text-base",
    ring: "ring-2 ring-offset-2",
    online: "w-3   h-3",
  },
  xl: {
    container: "w-20 h-20",
    text: "text-xl",
    ring: "ring-3 ring-offset-2",
    online: "w-3.5 h-3.5",
  },
  "2xl": {
    container: "w-28 h-28",
    text: "text-3xl",
    ring: "ring-4 ring-offset-3",
    online: "w-4   h-4",
  },
};

const levelRingColors: Record<UserLevel, string> = {
  [UserLevel.BEGINNER]: "ring-level-beginner     ring-offset-game-bg",
  [UserLevel.INTERMEDIATE]: "ring-level-intermediate ring-offset-game-bg",
  [UserLevel.ADVANCED]: "ring-level-advanced     ring-offset-game-bg",
};

// Genera un color de avatar basado en el nombre
const getAvatarColor = (name: string): string => {
  const colors = [
    "from-primary-500 to-purple-500",
    "from-success to-primary-500",
    "from-xp to-streak",
    "from-purple-500 to-pink-500",
    "from-streak to-danger",
    "from-primary-400 to-success",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Obtiene las iniciales del nombre
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const Avatar = ({
  src,
  displayName,
  level,
  size = "md",
  showLevelRing = false,
  showOnline = false,
  animated = false,
  className,
}: AvatarProps) => {
  const s = sizes[size];
  const initials = getInitials(displayName);
  const gradientColor = getAvatarColor(displayName);

  const ringClass =
    showLevelRing && level ? `${s.ring} ${levelRingColors[level]}` : "";

  const content = (
    <div className={clsx("relative shrink-0", className)}>
      {/* Avatar principal */}
      <div
        className={clsx(
          "relative rounded-full overflow-hidden flex items-center justify-center",
          s.container,
          ringClass,
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={displayName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          // Fallback con iniciales y gradiente
          <div
            className={clsx(
              "w-full h-full flex items-center justify-center",
              "bg-linear-to-br font-bold text-white",
              gradientColor,
            )}
          >
            <span className={s.text}>{initials}</span>
          </div>
        )}
      </div>

      {/* Indicador online */}
      {showOnline && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full",
            "bg-success-neon border-2 border-game-bg",
            s.online,
          )}
        />
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
