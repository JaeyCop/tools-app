"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  Home,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  X,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="lg:hidden sticky top-0 z-40">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4">
          <div className="h-16 flex items-center justify-between gap-4 relative">
            {/* Default View (Mobile and Desktop) */}
            <div
              className={`flex items-center gap-4 flex-1 transition-opacity ${
                isSearchOpen ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"
              }`}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg" />
                <span className="hidden sm:inline-block font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Simple Tools
                </span>
              </Link>

              <div className="flex-1" />

              {/* Desktop Search */}
              <form onSubmit={go} className="hidden md:flex flex-1 items-center max-w-xl">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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

              {/* Mobile Search Trigger */}
              <button
                type="button"
                onClick={openSearch}
                className="md:hidden p-2 -mr-2 rounded-full hover:bg-border/50"
                aria-label="Open search"
              >
                <Search className="h-5 w-5 text-muted" />
              </button>

              <div className="flex items-center">
                <ThemeSwitcher />
              </div>
            </div>

            {/* Mobile Search Overlay */}
            <div
              className={`md:hidden absolute inset-0 h-16 bg-surface transition-opacity duration-200 flex items-center px-2 gap-2 ${
                isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button type="button" onClick={closeSearch} className="p-2 rounded-full hover:bg-border/50">
                <ArrowLeft className="h-5 w-5 text-muted" />
              </button>
              <form onSubmit={go} className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for tools..."
                  className="w-full pl-4 pr-9 py-2 rounded-xl bg-background border border-border text-sm focus-premium"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="absolute inset-y-0 right-3 flex items-center">
                    <X className="h-4 w-4 text-muted hover:text-foreground" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}