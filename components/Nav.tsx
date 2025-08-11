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
  Eraser,
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
            href: "/image/remove-bg",
            label: "Remove Background",
            icon: Eraser,
            description: "Remove image background",
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
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-900">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Simple Tools
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  File Processing Suite
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
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  pathname === "/"
                    ? "bg-blue-100 dark:bg-blue-800/30"
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
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
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                        isActive(tool.href)
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-800/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive(tool.href)
                          ? "bg-blue-100 dark:bg-blue-800/30"
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
                      }`}>
                        <tool.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tool.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                          {tool.description}
                        </div>
                      </div>
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>© 2024 Simple Tools</span>
                <span className="text-green-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}