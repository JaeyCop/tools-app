"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook for reporting errors to a service
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl py-24 text-center">
      <h1 className="text-3xl font-semibold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">An unexpected error occurred. Try again, or reload the page.</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => reset()} className="rounded bg-primary px-4 py-2 text-primary-foreground">Try again</button>
        <button onClick={() => window.location.reload()} className="rounded border px-4 py-2">Reload</button>
      </div>
    </div>
  );
}
