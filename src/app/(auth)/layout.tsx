export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradiente radial superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary-500/10 blur-[120px] rounded-full" />
        {/* Gradiente radial inferior */}
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/10 blur-[100px] rounded-full" />

        {/* Grid decorativo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
