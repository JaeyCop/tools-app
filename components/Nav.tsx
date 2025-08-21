"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  GitMerge,
  Scissors,
  FileImage,
  Archive,
  Move,
  FileText,
  RefreshCw,
  Home,
  Zap,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Workflow,
  Settings,
  HelpCircle,
  BookOpen,
  Users,
  MessageSquare,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Image from "next/image";
import logoPng from "@/app/jaeyguides-logo.png";

export default function ResponsiveSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['PDF Tools', 'Image Tools']);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toolCategories = useMemo(
    () => [
      {
        name: "PDF Tools",
        icon: FileText,
        tools: [
          {
            href: "/pdf/merge",
            label: "Merge PDFs",
            icon: GitMerge,
            description: "Combine multiple PDFs into one",
          },
          {
            href: "/pdf/split",
            label: "Split PDF",
            icon: Scissors,
            description: "Extract pages from PDF",
          },
          {
            href: "/pdf/compress",
            label: "Compress PDF",
            icon: Archive,
            description: "Reduce PDF file size",
          },
          {
            href: "/pdf/to-images",
            label: "PDF to Images",
            icon: FileImage,
            description: "Convert PDF to images",
          },
        ],
      },
      {
        name: "Image Tools",
        icon: FileImage,
        tools: [
          {
            href: "/image/resize",
            label: "Resize Image",
            icon: Move,
            description: "Change image dimensions",
          },
          {
            href: "/image/convert",
            label: "Convert Format",
            icon: RefreshCw,
            description: "Convert image formats",
          },
          {
            href: "/image/compress",
            label: "Compress Image",
            icon: Archive,
            description: "Reduce image file size",
          },
          {
            href: "/image/to-pdf",
            label: "Images to PDF",
            icon: FileText,
            description: "Convert images to PDF",
          },
        ],
      },
    ],
    []
  );

  const SidebarContent = () => (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-gradient-to-b from-surface/95 to-surface/90 backdrop-blur-xl border-r border-border/30 shadow-2xl">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-gradient-to-r from-border/20 via-border/50 to-border/20 bg-gradient-to-r from-surface/60 via-surface/80 to-surface/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50"></div>
        <Link href="/" className="flex items-center justify-center w-full group relative z-10" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="sr-only">JaeyGuides</span>
          <div className="relative">
            <Image 
              src={logoPng} 
              alt="JaeyGuides" 
              width={300} 
              height={50} 
              className="brand-logo object-contain w-[200px] h-[50px] transition-all duration-500 group-hover:scale-105" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent pointer-events-none"></div>
        {/* Home */}
        <div className="relative z-10">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
              pathname === "/"
                ? "bg-gradient-to-r from-primary/15 via-primary/20 to-secondary/15 text-primary shadow-xl border border-primary/20 scale-[1.02]"
                : "text-muted hover:text-primary hover:bg-gradient-to-r hover:from-primary/8 hover:via-primary/10 hover:to-secondary/8 hover:border-primary/15 border border-transparent hover:scale-[1.01] hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`relative p-3 rounded-xl transition-all duration-500 ${
              pathname === "/"
                ? "bg-gradient-to-br from-primary/25 to-secondary/25 shadow-lg"
                : "bg-gradient-to-br from-surface/80 to-surface/60 group-hover:from-primary/15 group-hover:to-secondary/15 group-hover:shadow-md"
            }`}>
              <Home className={`h-5 w-5 transition-all duration-500 ${
                pathname === "/"
                  ? "text-primary drop-shadow-sm"
                  : "text-foreground/70 group-hover:text-primary group-hover:scale-110 group-hover:drop-shadow-sm"
              }`} />
            </div>
            <span className="relative font-semibold tracking-wide">Dashboard</span>
            {pathname === "/" && (
              <div className="ml-auto relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-ping opacity-75" />
              </div>
            )}
          </Link>
        </div>

        {/* Tool Categories */}
        {toolCategories.map((category, categoryIndex) => {
          const isExpanded = expandedCategories.includes(category.name);
          return (
            <div key={category.name} className="relative z-10 space-y-4 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-primary/8 hover:to-secondary/8 rounded-2xl transition-all duration-500 group relative overflow-hidden border border-transparent hover:border-primary/15 hover:shadow-lg hover:scale-[1.01]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/12 to-secondary/12 border border-primary/15 group-hover:border-primary/25 transition-all duration-500 group-hover:shadow-md group-hover:scale-105">
                  <category.icon className="h-5 w-5 text-primary transition-all duration-500 group-hover:drop-shadow-sm" />
                </div>
                <h3 className="relative text-sm font-bold text-foreground tracking-wide flex-1 text-left group-hover:text-primary transition-colors duration-500">
                  {category.name}
                </h3>
                <div className="relative transition-all duration-500 group-hover:scale-110">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted group-hover:text-primary transition-colors duration-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors duration-500" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="space-y-3 animate-slide-down ml-4 pl-4 border-l border-gradient-to-b from-primary/20 via-primary/10 to-transparent">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-500 relative overflow-hidden ${
                        isActive(tool.href)
                          ? "bg-gradient-to-r from-primary/18 via-primary/22 to-secondary/18 text-primary shadow-xl border border-primary/25 scale-[1.02] translate-x-1"
                          : "text-muted hover:text-foreground hover:bg-gradient-to-r hover:from-primary/6 hover:via-primary/8 hover:to-secondary/6 hover:shadow-lg hover:border-primary/12 border border-transparent hover:scale-[1.01] hover:translate-x-1"
                      }`}
                      style={{ animationDelay: `${categoryIndex * 0.1 + toolIndex * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className={`relative p-2.5 rounded-lg transition-all duration-500 ${
                        isActive(tool.href)
                          ? "bg-gradient-to-br from-primary/22 to-secondary/22 shadow-md"
                          : "bg-gradient-to-br from-surface/70 to-surface/50 group-hover:from-primary/12 group-hover:to-secondary/12 group-hover:shadow-sm group-hover:scale-105"
                      }`}>
                        <tool.icon className={`h-4 w-4 transition-all duration-500 ${
                          isActive(tool.href)
                            ? "text-primary drop-shadow-sm"
                            : "text-foreground/65 group-hover:text-primary group-hover:scale-110 group-hover:drop-shadow-sm"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0 relative">
                        <div className="font-semibold truncate group-hover:text-primary transition-colors duration-500">
                          {tool.label}
                        </div>
                        <div className="text-xs text-muted/80 truncate group-hover:text-muted-foreground transition-colors duration-500 mt-0.5">
                          {tool.description}
                        </div>
                      </div>
                      {isActive(tool.href) && (
                        <div className="relative">
                          <div className="p-1.5 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 shadow-lg">
                            <Zap className="h-3 w-3 text-primary animate-pulse" />
                          </div>
                          <div className="absolute inset-0 p-1.5 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 animate-ping opacity-75"></div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Additional Links */}
        <div className="relative z-10 pt-6 border-t border-gradient-to-r from-transparent via-border/40 to-transparent space-y-4">
          <Link
            href="/guides"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
              isActive("/guides")
                ? "bg-gradient-to-r from-accent/15 via-accent/20 to-primary/15 text-accent shadow-xl border border-accent/20 scale-[1.02]"
                : "text-muted hover:text-primary hover:bg-gradient-to-r hover:from-accent/8 hover:via-accent/10 hover:to-primary/8 hover:border-accent/15 border border-transparent hover:scale-[1.01] hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`relative p-3 rounded-xl transition-all duration-500 ${
              isActive("/guides")
                ? "bg-gradient-to-br from-accent/25 to-primary/25 shadow-lg"
                : "bg-gradient-to-br from-surface/80 to-surface/60 group-hover:from-accent/15 group-hover:to-primary/15 group-hover:shadow-md"
            }`}>
              <BookOpen className={`h-5 w-5 transition-all duration-500 ${
                isActive("/guides")
                  ? "text-accent drop-shadow-sm"
                  : "text-foreground/70 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-sm"
              }`} />
            </div>
            <span className="relative font-semibold tracking-wide">Guides & Tutorials</span>
            {isActive("/guides") && (
              <div className="ml-auto relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary animate-ping opacity-75" />
              </div>
            )}
          </Link>

          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
              isActive("/blog")
                ? "bg-gradient-to-r from-primary/15 via-primary/20 to-secondary/15 text-primary shadow-xl border border-primary/20 scale-[1.02]"
                : "text-muted hover:text-primary hover:bg-gradient-to-r hover:from-primary/8 hover:via-primary/10 hover:to-secondary/8 hover:border-primary/15 border border-transparent hover:scale-[1.01] hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`relative p-3 rounded-xl transition-all duration-500 ${
              isActive("/blog")
                ? "bg-gradient-to-br from-primary/25 to-secondary/25 shadow-lg"
                : "bg-gradient-to-br from-surface/80 to-surface/60 group-hover:from-primary/15 group-hover:to-secondary/15 group-hover:shadow-md"
            }`}>
              <MessageSquare className={`h-5 w-5 transition-all duration-500 ${
                isActive("/blog")
                  ? "text-primary drop-shadow-sm"
                  : "text-foreground/70 group-hover:text-primary group-hover:scale-110 group-hover:drop-shadow-sm"
              }`} />
            </div>
            <span className="relative font-semibold tracking-wide">Blog & Resources</span>
            {isActive("/blog") && (
              <div className="ml-auto relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-ping opacity-75" />
              </div>
            )}
          </Link>

          <Link
            href="/faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
              pathname === "/faq"
                ? "bg-gradient-to-r from-secondary/15 via-secondary/20 to-accent/15 text-secondary shadow-xl border border-secondary/20 scale-[1.02]"
                : "text-muted hover:text-primary hover:bg-gradient-to-r hover:from-secondary/8 hover:via-secondary/10 hover:to-accent/8 hover:border-secondary/15 border border-transparent hover:scale-[1.01] hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`relative p-3 rounded-xl transition-all duration-500 ${
              pathname === "/faq"
                ? "bg-gradient-to-br from-secondary/25 to-accent/25 shadow-lg"
                : "bg-gradient-to-br from-surface/80 to-surface/60 group-hover:from-secondary/15 group-hover:to-accent/15 group-hover:shadow-md"
            }`}>
              <HelpCircle className={`h-5 w-5 transition-all duration-500 ${
                pathname === "/faq"
                  ? "text-secondary drop-shadow-sm"
                  : "text-foreground/70 group-hover:text-secondary group-hover:scale-110 group-hover:drop-shadow-sm"
              }`} />
            </div>
            <span className="relative font-semibold tracking-wide">FAQ & Support</span>
            {pathname === "/faq" && (
              <div className="ml-auto relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-accent animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-accent animate-ping opacity-75" />
              </div>
            )}
          </Link>

          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
              pathname === "/about"
                ? "bg-gradient-to-r from-accent/15 via-accent/20 to-secondary/15 text-accent shadow-xl border border-accent/20 scale-[1.02]"
                : "text-muted hover:text-primary hover:bg-gradient-to-r hover:from-accent/8 hover:via-accent/10 hover:to-secondary/8 hover:border-accent/15 border border-transparent hover:scale-[1.01] hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`relative p-3 rounded-xl transition-all duration-500 ${
              pathname === "/about"
                ? "bg-gradient-to-br from-accent/25 to-secondary/25 shadow-lg"
                : "bg-gradient-to-br from-surface/80 to-surface/60 group-hover:from-accent/15 group-hover:to-secondary/15 group-hover:shadow-md"
            }`}>
              <Users className={`h-5 w-5 transition-all duration-500 ${
                pathname === "/about"
                  ? "text-accent drop-shadow-sm"
                  : "text-foreground/70 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-sm"
              }`} />
            </div>
            <span className="relative font-semibold tracking-wide">About Us</span>
            {pathname === "/about" && (
              <div className="ml-auto relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-secondary animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-accent to-secondary animate-ping opacity-75" />
              </div>
            )}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gradient-to-r from-border/20 via-border/50 to-border/20 bg-gradient-to-r from-surface/70 via-surface/90 to-surface/70 backdrop-blur-sm space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-50"></div>
        
        {/* Theme Switcher */}
        <div className="relative flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground tracking-wide">Theme</span>
          <div className="p-1 rounded-xl bg-gradient-to-r from-surface/80 to-surface/60 border border-border/30">
            <ThemeSwitcher />
          </div>
        </div>
        
        {/* Status */}
        <div className="relative flex items-center justify-between text-xs">
          <span className="text-muted font-semibold tracking-wide">© 2024 JaeyGuides</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-success/15 to-success/10 border border-success/25 shadow-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-sm" />
              <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-success font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:z-50 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}