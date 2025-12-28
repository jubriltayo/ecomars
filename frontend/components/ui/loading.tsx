interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "min-h-[60vh] flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="h-8 w-8 mx-auto rounded-full bg-gradient-primary animate-pulse mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
