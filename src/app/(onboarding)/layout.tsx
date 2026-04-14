export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-game-bg relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-125 h-125 bg-primary-500/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/8 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-success/5 blur-[100px] rounded-full" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
