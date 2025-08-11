"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
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
} from "lucide-react";

export default function ResponsiveSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-1 min-h-0 bg-surface border-r border-border">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border bg-surface">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  JaeyGuides
                </span>
                <span className="text-xs text-muted">
                  JaeyGuides Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Home */}
            <div>
              <Link
                href="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  pathname === "/"
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted hover:text-primary hover:bg-muted/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  pathname === "/"
                    ? "bg-primary/20"
                    : "bg-muted group-hover:bg-primary/10"
                }`}>
                  <Home className="h-4 w-4" />
                </div>
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Tool Categories */}
            {toolCategories.map((category) => (
              <div key={category.name} className="space-y-3">
                <div className="flex items-center gap-2 px-4">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <category.icon className="h-4 w-4 text-muted" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
                <div className="space-y-1">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                        isActive(tool.href)
                          ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                          : "text-muted hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive(tool.href)
                          ? "bg-primary/20"
                          : "bg-muted group-hover:bg-primary/10"
                      }`}>
                        <tool.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tool.label}</div>
                        <div className="text-xs text-muted truncate">
                          {tool.description}
                        </div>
                      </div>
                      {isActive(tool.href) && (
                        <div className="p-1 rounded-full bg-primary/20">
                          <Zap className="h-3 w-3 text-primary" />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>© 2024 JaeyGuides</span>
              <span className="text-success flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}