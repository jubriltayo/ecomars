interface AppBackgroundProps {
  children: React.ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="min-h-screen bg-app-background">
      <BackgroundElements />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function BackgroundElements() {
  return (
    <div className="background-elements">
      <div className="background-circle bg-linear-primary" />
      <div className="background-circle bg-linear-cool animation-delay-2000" />
      <div className="background-circle bg-linear-warm animation-delay-4000" />
    </div>
  );
}
