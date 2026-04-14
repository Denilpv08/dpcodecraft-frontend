"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Code2, Chrome } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { usersApi } from "@/lib/api/users.api";
import { clsx } from "clsx";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      router.replace("/dashboard");
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === "auth/invalid-credential") {
        toast.error("Email o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();

      // Intentar obtener perfil — si no existe, crearlo
      try {
        await usersApi.getMe();
      } catch {
        await usersApi.register({
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "Usuario",
          photoURL: firebaseUser.photoURL || undefined,
        });
      }

      router.replace("/dashboard");
    } catch {
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Code2 size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-gradient-primary">DPCode</span>
            <span className="text-white">Craft</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Aprende a programar jugando
          </p>
        </div>

        {/* Card */}
        <div className="bg-game-surface border border-game-border rounded-2xl p-6 shadow-card">
          {/* Línea decorativa */}
          <div className="h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent mb-6" />

          <h2 className="text-xl font-bold text-white mb-1">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Continúa tu aventura de aprendizaje
          </p>

          {/* Google */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoogleLogin}
            isLoading={isGoogleLoading}
            leftIcon={<Chrome size={18} />}
            className="mb-4"
          >
            Continuar con Google
          </Button>

          {/* Separador */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-game-border" />
            <span className="text-xs text-gray-600 font-medium">
              o con email
            </span>
            <div className="flex-1 h-px bg-game-border" />
          </div>

          {/* Formulario */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className={clsx(
                    "w-full bg-game-card border border-game-border rounded-xl",
                    "pl-10 pr-4 py-2.5 text-sm text-white",
                    "placeholder:text-gray-600",
                    "focus:outline-none focus:border-primary-500/60 focus:shadow-glow-primary",
                    "transition-all duration-200",
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={clsx(
                    "w-full bg-game-card border border-game-border rounded-xl",
                    "pl-10 pr-10 py-2.5 text-sm text-white",
                    "placeholder:text-gray-600",
                    "focus:outline-none focus:border-primary-500/60 focus:shadow-glow-primary",
                    "transition-all duration-200",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Link de recuperación */}
            <div className="flex justify-end -mt-2">
              <Link
                href="/forgot-password"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Link a registro */}
          <p className="text-center text-sm text-gray-500 mt-5">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
