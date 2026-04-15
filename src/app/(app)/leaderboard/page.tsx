"use client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Crown, Zap, Flame, Medal } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LevelBadge } from "@/components/game/LevelBadge";
import { useUser } from "@/hooks/useUser";
import { UserLevel } from "@/types/user.types";
import { formatXp } from "@/lib/utils/xp.utils";
import { clsx } from "clsx";
import { leaderboardApi } from "@/lib/api/leaderboard.api";

// Colores para top 3
const TOP3_CONFIG = [
  {
    rank: 1,
    color: "from-xp to-xp-glow",
    border: "border-xp/50",
    bg: "bg-xp/10",
    icon: "👑",
    size: "2xl" as const,
  },
  {
    rank: 2,
    color: "from-gray-300 to-gray-400",
    border: "border-gray-400/50",
    bg: "bg-gray-400/10",
    icon: "🥈",
    size: "xl" as const,
  },
  {
    rank: 3,
    color: "from-amber-600 to-amber-400",
    border: "border-amber-500/50",
    bg: "bg-amber-500/10",
    icon: "🥉",
    size: "xl" as const,
  },
];

export default function LeaderboardPage() {
  const { user } = useUser();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: leaderboardApi.getLeaderboard,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const myEntry = leaderboard.find((e) => e.userId === user?.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown size={28} className="text-xp fill-xp" />
          <h1 className="text-3xl font-black text-white">Ranking Global</h1>
          <Crown size={28} className="text-xp fill-xp" />
        </div>
        <p className="text-gray-400 text-sm">
          Los mejores programadores de DPCodeCraft
        </p>
      </motion.div>

      {/* ── TOP 3 ──────────────────────────────────────────── */}
      {!isLoading && top3.length > 0 && (
        <motion.div
          className="flex items-end justify-center gap-4 mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Reordenar: 2 - 1 - 3 para el podio */}
          {[top3[1], top3[0], top3[2]].map((entry, visualIndex) => {
            if (!entry) return null;

            const rankIndex = entry.rank - 1;
            const config = TOP3_CONFIG[rankIndex];
            const isFirst = entry.rank === 1;
            const isMe = entry.userId === user?.id;

            return (
              <motion.div
                key={entry.userId}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 relative",
                  config.border,
                  config.bg,
                  isFirst ? "pb-6" : "pb-4",
                )}
                style={{
                  marginBottom: isFirst ? 0 : "24px",
                  minWidth: isFirst ? "140px" : "120px",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: visualIndex * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Corona / Medalla */}
                <div className="absolute -top-4 text-2xl">{config.icon}</div>

                {/* Glow ring en primer lugar */}
                {isFirst && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-xp/30"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <Avatar
                  src={entry.photoURL}
                  displayName={entry.displayName}
                  level={entry.level as UserLevel}
                  size={config.size}
                  showLevelRing
                  animated
                />

                <div className="text-center">
                  <p
                    className={clsx(
                      "font-bold text-sm truncate max-w-25",
                      isMe ? "text-primary-300" : "text-white",
                    )}
                  >
                    {entry.displayName.split(" ")[0]}
                    {isMe && " (tú)"}
                  </p>

                  <div className="flex items-center justify-center gap-1 text-xp mt-1">
                    <Zap size={12} className="fill-xp" />
                    <span className="text-xs font-black">
                      {formatXp(entry.xp)}
                    </span>
                  </div>

                  {entry.currentStreak > 0 && (
                    <div className="flex items-center justify-center gap-1 text-streak-fire mt-0.5">
                      <Flame size={11} />
                      <span className="text-[11px] font-semibold">
                        {entry.currentStreak}d
                      </span>
                    </div>
                  )}
                </div>

                {/* Rank badge */}
                <div
                  className={clsx(
                    "absolute -bottom-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-game-bg",
                    "bg-linear-to-br",
                    config.color,
                    entry.rank === 1 ? "text-game-bg" : "text-white",
                  )}
                >
                  {entry.rank}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Lista resto ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-game-surface rounded-2xl animate-pulse"
              />
            ))
          : rest.map((entry, i) => {
              const isMe = entry.userId === user?.id;

              return (
                <motion.div
                  key={entry.userId}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                    isMe
                      ? "bg-primary-500/10 border-primary-500/30 shadow-glow-primary"
                      : "bg-game-surface border-game-border hover:border-game-hover",
                  )}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Rank */}
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0",
                      isMe
                        ? "bg-primary-500/20 text-primary-300"
                        : "bg-game-card text-gray-500",
                    )}
                  >
                    {entry.rank}
                  </div>

                  {/* Avatar */}
                  <Avatar
                    src={entry.photoURL}
                    displayName={entry.displayName}
                    level={entry.level as UserLevel}
                    size="sm"
                    showLevelRing
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={clsx(
                          "text-sm font-bold truncate",
                          isMe ? "text-primary-300" : "text-white",
                        )}
                      >
                        {entry.displayName}
                        {isMe && (
                          <span className="text-primary-400 ml-1 text-xs">
                            (tú)
                          </span>
                        )}
                      </p>
                      <LevelBadge
                        level={entry.level as UserLevel}
                        size="xs"
                        showIcon={false}
                      />
                    </div>

                    {/* Racha */}
                    {entry.currentStreak > 0 && (
                      <div className="flex items-center gap-1 text-streak-fire mt-0.5">
                        <Flame size={11} />
                        <span className="text-xs font-semibold">
                          {entry.currentStreak} días
                        </span>
                      </div>
                    )}
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1.5 text-xp shrink-0">
                    <Zap size={14} className="fill-xp" />
                    <span className="text-sm font-black">
                      {formatXp(entry.xp)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* ── Mi posición si no estoy en top 20 ──────────────── */}
      {myEntry && myEntry.rank > 20 && (
        <motion.div
          className="mt-6 p-4 rounded-2xl border-2 border-primary-500/40 bg-primary-500/10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-500 text-center mb-3">Tu posición</p>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-sm font-black text-primary-300">
              {myEntry.rank}
            </div>
            <Avatar
              src={user?.photoURL}
              displayName={user?.displayName ?? ""}
              level={user?.level}
              size="sm"
              showLevelRing
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-primary-300">
                {user?.displayName} (tú)
              </p>
            </div>
            <div className="flex items-center gap-1 text-xp">
              <Zap size={14} className="fill-xp" />
              <span className="text-sm font-black">{formatXp(myEntry.xp)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
