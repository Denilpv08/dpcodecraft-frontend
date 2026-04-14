"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Flame,
  Heart,
  Map,
  LayoutDashboard,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Code2,
} from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { XPBar } from "@/components/game/XPBar";
import { StreakCounter } from "@/components/game/StreakCounter";
import { LivesDisplay } from "@/components/game/LivesDisplay";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { formatXp } from "@/lib/utils/xp.utils";

const navLinks = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/learn", label: "Aprender", icon: Map },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-game-bg/80 backdrop-blur-xl border-b border-game-border" />

      <nav className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Code2 size={18} className="text-white" />
          </motion.div>
          <span className="font-black text-lg tracking-tight hidden sm:block">
            <span className="text-gradient-primary">DPCode</span>
            <span className="text-white">Craft</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-linear-to-r from-primary-500/20 to-purple-500/20 rounded-xl border border-primary-500/30"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Stats + Avatar */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            {/* Stats compactos — desktop */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-game-surface rounded-xl border border-game-border">
              {/* XP */}
              <div className="flex items-center gap-1.5 text-xp">
                <Zap size={14} className="fill-xp" />
                <span className="text-xs font-bold">{formatXp(user.xp)}</span>
              </div>

              <div className="w-px h-4 bg-game-border" />

              {/* Racha */}
              <StreakCounter streak={user.currentStreak} compact />

              <div className="w-px h-4 bg-game-border" />

              {/* Vidas */}
              <LivesDisplay lives={user.lives} compact />
            </div>

            {/* Avatar con dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setProfileOpen(!profileOpen)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Avatar
                  src={user.photoURL}
                  displayName={user.displayName}
                  level={user.level}
                  size="sm"
                  showLevelRing
                />
                <span className="hidden sm:block text-sm font-semibold text-white max-w-25 truncate">
                  {user.displayName.split(" ")[0]}
                </span>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <>
                    {/* Overlay para cerrar */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />

                    <motion.div
                      className="absolute right-0 top-12 z-50 w-72 bg-game-surface border border-game-border rounded-2xl shadow-card-hover overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                      }}
                    >
                      {/* Línea decorativa */}
                      <div className="h-px bg-linear-to-r from-transparent via-primary-500/60 to-transparent" />

                      {/* Header del dropdown */}
                      <div className="p-4 border-b border-game-border">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.photoURL}
                            displayName={user.displayName}
                            level={user.level}
                            size="md"
                            showLevelRing
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* XP Bar en dropdown */}
                        <div className="mt-3">
                          <XPBar xp={user.xp} level={user.level} showDetails />
                        </div>
                      </div>

                      {/* Stats en dropdown */}
                      <div className="grid grid-cols-3 divide-x divide-game-border p-3">
                        <div className="flex flex-col items-center gap-0.5 px-2">
                          <StreakCounter streak={user.currentStreak} compact />
                          <span className="text-[10px] text-gray-500">
                            Racha
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 px-2">
                          <LivesDisplay lives={user.lives} compact />
                          <span className="text-[10px] text-gray-500">
                            Vidas
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 px-2">
                          <span className="text-sm font-bold text-purple-400">
                            {user.achievements.length}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Logros
                          </span>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="p-2 border-t border-game-border">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={16} />
                          Ver perfil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors"
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden relative bg-game-surface border-b border-game-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary-500/15 text-primary-300 border border-primary-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
