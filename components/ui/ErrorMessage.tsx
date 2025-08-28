import { AlertCircle, RefreshCw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  suggestions?: string[];
  className?: string;
}

export default function ErrorMessage({ error, onRetry, suggestions = [], className }: ErrorMessageProps) {
  return (
    <div className={cn("rounded-xl border border-error/20 bg-error/5 p-4", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-error">{error}</p>
          
          {suggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted font-medium">Try these solutions:</p>
              <ul className="text-xs text-muted space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 text-xs text-error hover:text-error/80 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SuccessMessage({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-success/20 bg-success/5 p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <p className="text-sm font-medium text-success">{message}</p>
      </div>
    </div>
  );
}

export function InfoMessage({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-primary/20 bg-primary/5 p-4", className)}>
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5 text-primary" />
        <p className="text-sm text-primary">{message}</p>
      </div>
    </div>
  );
}