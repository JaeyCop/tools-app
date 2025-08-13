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
    <div className="flex flex-col flex-1 min-h-0 bg-surface/95 backdrop-blur-xl border-r border-border/50">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 group ml-1" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="sr-only">JaeyGuides</span>
          <div className="p-[2px] rounded-lg bg-gradient-to-br from-primary via-secondary to-accent">
            <div className="rounded-md bg-surface p-1">
              <Image src={logoPng} alt="JaeyGuides" width={210} height={50} className="brand-logo object-contain w-[220px] h-[56px]" />
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Home */}
        <div>
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group interactive ${
              pathname === "/"
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-lg border border-primary/20"
                : "text-muted hover:text-primary hover:bg-surface-elevated/50 hover:border-primary/10 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              pathname === "/"
                ? "bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm"
                : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/10"
            }`}>
              <Home className={`h-4 w-4 transition-all duration-300 ${
                pathname === "/"
                  ? "text-primary"
                  : "text-foreground/60 group-hover:text-primary group-hover:scale-110"
              }`} />
            </div>
            <span className="font-medium">Dashboard</span>
            {pathname === "/" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        </div>

        {/* Tool Categories */}
        {toolCategories.map((category, categoryIndex) => {
          const isExpanded = expandedCategories.includes(category.name);
          return (
            <div key={category.name} className="space-y-3 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-elevated/30 rounded-lg transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 group-hover:border-primary/20 transition-all duration-200">
                  <category.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground tracking-wide flex-1 text-left">
                  {category.name}
                </h3>
                <div className="transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="space-y-1 animate-slide-down">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate group-hover:text-primary transition-colors duration-300">
                          {tool.label}
                        </div>
                        <div className="text-xs text-muted truncate group-hover:text-muted-foreground transition-colors duration-300">
                          {tool.description}
                        </div>
                      </div>
                      {isActive(tool.href) && (
                        <div className="p-1 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse">
                          <Zap className="h-3 w-3 text-primary" />
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
        <div className="space-y-1 pt-4 border-t border-border/30">
          <Link
            href="/workflow"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group interactive ${
              pathname === "/workflow"
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-lg border border-primary/20"
                : "text-muted hover:text-primary hover:bg-surface-elevated/50 hover:border-primary/10 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              pathname === "/workflow"
                ? "bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm"
                : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/10"
            }`}>
              <Workflow className={`h-4 w-4 transition-all duration-300 ${
                pathname === "/workflow"
                  ? "text-primary"
                  : "text-foreground/60 group-hover:text-primary group-hover:scale-110"
              }`} />
            </div>
            <span className="font-medium">Workflow Builder</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-surface/80 backdrop-blur-sm space-y-4">
        {/* Theme Switcher */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ThemeSwitcher />
        </div>
        
        {/* Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted font-medium">© 2024 JaeyGuides</span>
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl bg-surface/95 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
          ) : (
            <Menu className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </aside>
    </>
  );
}