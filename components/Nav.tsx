"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Image,
  GitMerge,
  Scissors,
  Archive,
  Move,
  FileImage,
  RefreshCw,
  Eraser,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'pdf' | 'image';
};

const NAV_ITEMS: NavItem[] = [
  { href: "/pdf/merge", label: "Merge PDFs", icon: GitMerge, category: 'pdf' },
  { href: "/pdf/split", label: "Split PDF", icon: Scissors, category: 'pdf' },
  { href: "/pdf/to-images", label: "PDF to Images", icon: FileImage, category: 'pdf' },
  { href: "/pdf/compress", label: "Compress PDF", icon: Archive, category: 'pdf' },
  { href: "/image/resize", label: "Resize Image", icon: Move, category: 'image' },
  { href: "/image/to-pdf", label: "Images to PDF", icon: FileText, category: 'image' },
  { href: "/image/convert", label: "Convert Format", icon: RefreshCw, category: 'image' },
  { href: "/image/compress", label: "Compress Image", icon: Archive, category: 'image' },
  { href: "/image/remove-bg", label: "Remove Background", icon: Eraser, category: 'image' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const pdfItems = NAV_ITEMS.filter(item => item.category === 'pdf');
  const imageItems = NAV_ITEMS.filter(item => item.category === 'image');

  // Handle link clicks on mobile - close sidebar after navigation
  const handleLinkClick = useCallback(() => {
    // Only close on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // Add small delay to ensure navigation completes
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [onClose]);

  // Close sidebar when route actually changes (not on mount)
  useEffect(() => {
    if (previousPathname.current !== pathname && previousPathname.current !== null) {
      // Only close on mobile and when pathname actually changed
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        onClose();
      }
    }
    previousPathname.current = pathname;
  }, [pathname, onClose]);

  return (
    <div className="h-full flex flex-col bg-surface dark:bg-surface border-r border-border shadow-premium">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={handleLinkClick}
          >
            <div className="p-2 rounded-xl gradient-primary shadow-premium group-hover:shadow-premium-lg transition-all duration-300 group-hover:scale-105">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Simple Tools
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Fast & Private Utilities
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-border/50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* PDF Tools Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 shadow-premium">
              <div className="p-1.5 rounded-md bg-primary/20 backdrop-blur-sm">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                PDF Tools
              </span>
            </div>
            <nav className="space-y-1">
              {pdfItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${active
                        ? "gradient-primary text-white shadow-premium scale-[1.02]"
                        : "text-muted hover:text-foreground hover:bg-border/30 hover:shadow-md"
                      }`}
                    onClick={handleLinkClick}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-200 ${active ? "text-white" : "text-muted group-hover:text-primary"
                      }`} />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <ChevronRight className="h-3 w-3 text-white/70" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Image Tools Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-secondary/10 to-secondary/20 border border-secondary/20 shadow-premium">
              <div className="p-1.5 rounded-md bg-secondary/20 backdrop-blur-sm">
                <Image className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
                Image Tools
              </span>
            </div>
            <nav className="space-y-1">
              {imageItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${active
                        ? "gradient-accent text-white shadow-premium scale-[1.02]"
                        : "text-muted hover:text-foreground hover:bg-border/30 hover:shadow-md"
                      }`}
                    onClick={handleLinkClick}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-200 ${active ? "text-white" : "text-muted group-hover:text-secondary"
                      }`} />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <ChevronRight className="h-3 w-3 text-white/70" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>© {new Date().getFullYear()} Simple Tools</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-md shadow-success/50"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResponsiveSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Memoize the close function to prevent unnecessary re-renders
  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        closeMobile();
      }
    };
    
    if (isMobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMobileOpen, closeMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [isMobileOpen]);

  // Handle backdrop click with proper event handling
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      closeMobile();
    }
  }, [closeMobile]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={openMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl gradient-primary border border-border shadow-premium backdrop-blur-xl hover:shadow-premium-lg transition-all duration-200"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 pt-16">
        <SidebarContent isOpen={true} onClose={() => {}} />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-label="Close sidebar"
          />

          {/* Mobile Sidebar Panel */}
          <aside 
            className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out ${
              isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarContent isOpen={isMobileOpen} onClose={closeMobile} />
          </aside>
        </>
      )}

      {/* Spacer to avoid overlapping with bottom tabs */}
      <div className="h-16 lg:h-0" />
    </>
  );
}
