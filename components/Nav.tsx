"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const pdfItems = NAV_ITEMS.filter(item => item.category === 'pdf');
  const imageItems = NAV_ITEMS.filter(item => item.category === 'image');

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <div className="h-full flex flex-col bg-primary border-r border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => window.innerWidth < 1024 && onClose()}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-accent shadow-lg shadow-secondary/25 group-hover:shadow-secondary/40 transition-all duration-300 group-hover:scale-105">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight group-hover:text-secondary transition-colors">
                Simple Tools
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Fast & Private Utilities
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* PDF Tools Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-secondary/20 to-secondary/30 border border-secondary/30 shadow-lg shadow-secondary/10">
              <div className="p-1.5 rounded-md bg-secondary/30 backdrop-blur-sm">
                <FileText className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
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
                        ? "bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-secondary/25 scale-[1.02]"
                        : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-md"
                      }`}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-200 ${active ? "text-white" : "text-gray-400 group-hover:text-secondary"
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
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Image Tools Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-accent/20 to-accent/30 border border-accent/30 shadow-lg shadow-accent/10">
              <div className="p-1.5 rounded-md bg-accent/30 backdrop-blur-sm">
                <Image className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
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
                        ? "bg-gradient-to-r from-accent to-secondary text-white shadow-lg shadow-accent/25 scale-[1.02]"
                        : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-md"
                      }`}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-200 ${active ? "text-white" : "text-gray-400 group-hover:text-accent"
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
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Simple Tools</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-md shadow-green-500/50"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResponsiveSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-primary border border-white/10 shadow-lg shadow-black/25 backdrop-blur-xl hover:bg-primary/80 transition-all duration-200"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72">
        <SidebarContent isOpen={true} onClose={() => { }} />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Mobile Sidebar Panel */}
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out">
            <SidebarContent isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}