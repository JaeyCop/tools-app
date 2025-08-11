import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  );
}

export function LoadingDots({ className, text }: { className?: string; text?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      {text && <span className="text-sm text-muted ml-2">{text}</span>}
    </div>
  );
}

export function LoadingPulse({ className, text }: { className?: string; text?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  );
}