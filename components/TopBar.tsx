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
  Menu,
  GitMerge,
  Scissors,
  FileImage,
  Archive,
  Move,
  RefreshCw,
  Zap,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toolCategories = useMemo(
    () => [
      {
        name: "PDF Tools",
        icon: FileText,
        tools: [
          { href: "/pdf/merge", label: "Merge PDFs", icon: GitMerge },
          { href: "/pdf/split", label: "Split PDF", icon: Scissors },
          { href: "/pdf/compress", label: "Compress PDF", icon: Archive },
          { href: "/pdf/to-images", label: "PDF to Images", icon: FileImage },
        ],
      },
      {
        name: "Image Tools",
        icon: ImageIcon,
        tools: [
          { href: "/image/resize", label: "Resize Image", icon: Move },
          { href: "/image/convert", label: "Convert Format", icon: RefreshCw },
          { href: "/image/compress", label: "Compress Image", icon: Archive },
          { href: "/image/to-pdf", label: "Images to PDF", icon: FileText },
        ],
      },
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
            {/* Default View (Mobile) */}
            <div
              className={`flex items-center gap-4 flex-1 transition-opacity ${
                isSearchOpen ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"
              }`}
            >
              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-full hover:bg-border/50"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-muted" />
              </button>

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

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl flex flex-col">
            <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">Simple Tools</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-border/50"
              >
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isActive("/") ? "bg-blue-100 dark:bg-blue-800/30" : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <Home className="h-4 w-4" />
                </div>
                <span>Home</span>
              </Link>

              {toolCategories.map((category) => (
                <div key={category.name} className="mt-4">
                  <div className="flex items-center gap-2 px-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                      <category.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                          isActive(tool.href)
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive(tool.href) ? "bg-blue-100 dark:bg-blue-800/30" : "bg-gray-100 dark:bg-gray-800"
                        }`}>
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 truncate">{tool.label}</span>
                        {isActive(tool.href) && (
                          <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-800/30">
                            <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}