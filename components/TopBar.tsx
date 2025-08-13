"use client";

import Link from "next/link";
import Image from "next/image";
import logoPng from "@/app/jaeyguides-logo.png";
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
  Keyboard,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import KeyboardShortcutsHelp from "@/components/ui/KeyboardShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+/': () => setIsShortcutsOpen(true),
    'Ctrl+K': () => setIsSearchOpen(true),
    'Escape': () => {
      setIsSearchOpen(false);
      setIsShortcutsOpen(false);
      setIsMenuOpen(false);
    },
  });

  return (
    <div className="xl:hidden sticky top-0 z-40">
      <div className="backdrop-blur-xl bg-surface/90 border-b border-border/50 shadow-sm">
        <div className="px-4">
          <div className="h-16 flex items-center justify-between gap-4 relative">
            {/* Default View (Mobile & Tablet) */}
            <div
              className={`flex items-center gap-4 flex-1 transition-opacity ${
                isSearchOpen ? "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto" : "opacity-100"
              }`}
            >
              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-surface-elevated/50 border border-transparent hover:border-primary/10 transition-all duration-300 interactive"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-muted hover:text-primary transition-colors duration-300" />
              </button>

              <Link href="/" className="flex items-center gap-3 group ml-2 sm:ml-3">
                <span className="sr-only">JaeyGuides</span>
                <div className="p-[2px] rounded-lg bg-gradient-to-br from-primary via-secondary to-accent">
                  <div className="rounded-md bg-surface p-1">
                    <Image src={logoPng} alt="JaeyGuides" width={210} height={50} className="brand-logo object-contain w-[220px] h-[56px]" />
                  </div>
                </div>
              </Link>

              <div className="flex-1" />

              {/* Desktop Search */}
              <form onSubmit={go} className="hidden lg:flex flex-1 items-center max-w-xl">
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

              {/* Mobile & Tablet Search Trigger */}
              <button
                type="button"
                onClick={openSearch}
                className="lg:hidden p-2 -mr-2 rounded-full hover:bg-border/50"
                aria-label="Open search"
              >
                <Search className="h-5 w-5 text-muted" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsShortcutsOpen(true)}
                  className="p-2 rounded-full hover:bg-border/50"
                  aria-label="Keyboard shortcuts"
                  title="Keyboard shortcuts (Ctrl+/)"
                >
                  <Keyboard className="h-5 w-5 text-muted" />
                </button>
                <ThemeSwitcher />
              </div>
            </div>

            {/* Mobile & Tablet Search Overlay */}
            <div
              className={`lg:hidden absolute inset-0 h-16 bg-surface transition-opacity duration-200 flex items-center px-2 gap-2 ${
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

      {/* Mobile & Tablet Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden animate-slide-down">
          <button
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-surface/95 backdrop-blur-xl border-r border-border/50 shadow-2xl flex flex-col animate-slide-up">
            <div className="h-16 px-4 flex items-center justify-between border-b border-border/50 bg-surface/80 backdrop-blur-sm">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group">
                <span className="sr-only">JaeyGuides</span>
                <div className="p-[2px] rounded-lg bg-gradient-to-br from-primary via-secondary to-accent">
                  <div className="rounded-md bg-surface p-1">
                    <Image src={logoPng} alt="JaeyGuides" width={220} height={56} className="brand-logo object-contain w-[220px] h-[56px]" />
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-surface-elevated/50 border border-transparent hover:border-primary/10 transition-all duration-300 interactive"
              >
                <X className="h-5 w-5 text-muted hover:text-primary transition-colors duration-300" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="animate-slide-up">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 interactive ${
                    isActive("/")
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-lg border border-primary/20"
                      : "text-muted hover:text-primary hover:bg-surface-elevated/50 hover:border-primary/10 border border-transparent"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive("/") 
                      ? "bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm" 
                      : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/10"
                  }`}>
                    <Home className={`h-4 w-4 transition-all duration-300 ${
                      isActive("/") 
                        ? "text-primary" 
                        : "text-foreground/60 group-hover:text-primary group-hover:scale-110"
                    }`} />
                  </div>
                  <span className="font-medium">Dashboard</span>
                  {isActive("/") && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              </div>

              {toolCategories.map((category, categoryIndex) => (
                <div key={category.name} className="space-y-3 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
                      <category.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-wide">
                      {category.name}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {category.tools.map((tool, toolIndex) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 interactive animate-scale-in ${
                          isActive(tool.href)
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-lg border border-primary/20"
                            : "text-muted hover:text-foreground hover:bg-surface-elevated/50 hover:border-primary/10 border border-transparent"
                        }`}
                        style={{ animationDelay: `${categoryIndex * 0.1 + toolIndex * 0.05}s` }}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive(tool.href) 
                            ? "bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm" 
                            : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/10"
                        }`}>
                          <tool.icon className={`h-4 w-4 transition-all duration-300 ${
                            isActive(tool.href) 
                              ? "text-primary" 
                              : "text-foreground/60 group-hover:text-primary group-hover:scale-110"
                          }`} />
                        </div>
                        <span className="flex-1 truncate font-medium group-hover:text-primary transition-colors duration-300">
                          {tool.label}
                        </span>
                        {isActive(tool.href) && (
                          <div className="p-1 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse">
                            <Zap className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-auto border-t border-border/50 p-4 bg-surface/80 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-muted font-medium">© {new Date().getFullYear()} JaeyGuides</span>
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-success font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <Link 
                  href="/privacy" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-muted hover:text-primary transition-colors duration-300 font-medium"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-muted hover:text-primary transition-colors duration-300 font-medium"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        shortcuts={[
          { key: "Ctrl+Enter", description: "Start processing", category: "Actions" },
          { key: "Escape", description: "Close dialogs / Clear errors", category: "Navigation" },
          { key: "Delete", description: "Remove last file", category: "File Management" },
          { key: "Ctrl+/", description: "Show keyboard shortcuts", category: "Help" },
          { key: "Ctrl+K", description: "Focus search", category: "Navigation" },
          { key: "Arrow Keys", description: "Reorder files (when focused)", category: "File Management" },
        ]}
      />
    </div>
  );
}