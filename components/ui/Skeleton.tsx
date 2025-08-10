export default function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-black/10 dark:bg-white/10 ${className}`} />;
}
