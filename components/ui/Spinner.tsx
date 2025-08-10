export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] text-current motion-reduce:animate-[spin_1.5s_linear_infinite] " +
        className
      }
    />
  );
}
