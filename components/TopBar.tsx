"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Search, Home, FileText, Image as ImageIcon } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const isActive = useCallback(
    (href: string) => pathname === href || pathname?.startsWith(href + "/"),
    [pathname]
  );

  const go = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim().toLowerCase();
      if (!q) return;
      if (q.includes("pdf")) router.push("/pdf/merge");
      else if (q.includes("image")) router.push("/image/resize");
      else router.push("/");
    },
    [query, router]
  );

  const tabs = useMemo(
    () => [
      { href: "/", label: "Home", icon: Home },
      { href: "/pdf/merge", label: "PDF", icon: FileText },
      { href: "/image/resize", label: "Images", icon: ImageIcon },
    ],
    []
  );

  return (
    <div className="sticky top-0 z-40">
      <div className="backdrop-blur-xl bg-surface/70 dark:bg-surface/60 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center gap-4">
            <Link href="/" className="hidden sm:flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg gradient-primary shadow-premium" />
              <span className="font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Simple Tools
              </span>
            </Link>

            <form onSubmit={go} className="flex-1 flex items-center">
              <div className="relative w-full max-w-xl">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-muted" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools: e.g. PDF merge, image resize"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-sm focus-premium"
                />
              </div>
            </form>

            <nav className="hidden md:flex items-center gap-2">
              {tabs.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted hover:text-foreground hover:bg-border/40"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}