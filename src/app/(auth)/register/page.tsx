"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Code2,
  Chrome,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { registerWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { usersApi } from "@/lib/api/users.api";
import { clsx } from "clsx";
import toast from "react-hot-toast";

const passwordRequirements = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const passwordStrength = passwordRequirements.filter((r) =>
    r.test(password),
  ).length;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < passwordRequirements.length) {
      toast.error("La contraseña no cumple los requisitos");
      return;
    }

    setIsLoading(true);
    try {
      const firebaseUser = await registerWithEmail(email, password);

      // Crear perfil en el backend
      await usersApi.register({
        email: firebaseUser.email!,
        displayName,
      });

      toast.success("¡Cuenta creada! Bienvenido a DPCodeCraft 🚀");
      router.replace("/onboarding");
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        toast.error("Ya existe una cuenta con ese email");
      } else {
        toast.error("Error al crear la cuenta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();

      try {
        await usersApi.getMe();
      } catch {
        await usersApi.register({
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "Usuario",
          photoURL: firebaseUser.photoURL || undefined,
        });
      }

      router.replace("/onboarding");
    } catch {
      toast.error("Error al registrarse con Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Code2 size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-gradient-primary">DPCode</span>
            <span className="text-white">Craft</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tu aventura comienza aquí
          </p>
        </div>

        {/* Card */}
        <div className="bg-game-surface border border-game-border rounded-2xl p-6 shadow-card">
          <div className="h-px bg-linear-to-r from-transparent via-success/50 to-transparent mb-6" />

          <h2 className="text-xl font-bold text-white mb-1">
            Crear cuenta gratis
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Únete a miles de desarrolladores aprendiendo
          </p>

          {/* Google */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoogleRegister}
            isLoading={isGoogleLoading}
            leftIcon={<Chrome size={18} />}
            className="mb-4"
          >
            Registrarse con Google
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
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Nombre
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className={clsx(
                    "w-full bg-game-card border border-game-border rounded-xl",
                    "pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600",
                    "focus:outline-none focus:border-primary-500/60 focus:shadow-glow-primary",
                    "transition-all duration-200",
                  )}
                />
              </div>
            </div>

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
                    "pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600",
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
                    "pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600",
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

              {/* Requisitos de contraseña */}
              {password.length > 0 && (
                <motion.div
                  className="flex flex-col gap-1 mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {/* Barra de fuerza */}
                  <div className="flex gap-1 mb-1">
                    {passwordRequirements.map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "flex-1 h-1 rounded-full transition-all duration-300",
                          i < passwordStrength
                            ? passwordStrength === 1
                              ? "bg-danger"
                              : passwordStrength === 2
                                ? "bg-xp"
                                : "bg-success"
                            : "bg-game-border",
                        )}
                      />
                    ))}
                  </div>

                  {/* Lista de requisitos */}
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className={clsx(
                          "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0",
                          req.test(password) ? "bg-success" : "bg-game-border",
                        )}
                      >
                        {req.test(password) && (
                          <Check
                            size={8}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={clsx(
                          "text-[11px] transition-colors",
                          req.test(password)
                            ? "text-success-neon"
                            : "text-gray-600",
                        )}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="success"
              fullWidth
              isLoading={isLoading}
              size="lg"
              className="mt-1"
            >
              Crear cuenta gratis
            </Button>
          </form>

          {/* Términos */}
          <p className="text-center text-[11px] text-gray-600 mt-4">
            Al registrarte aceptas nuestros{" "}
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white underline"
            >
              Términos de servicio
            </Link>
          </p>

          {/* Link a login */}
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
