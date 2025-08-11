"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Image as ImageIcon } from "lucide-react";

export default function MobileTabs() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pdf/merge", label: "PDF", icon: FileText },
    { href: "/image/resize", label: "Images", icon: ImageIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-safe">
      <div className="mx-auto max-w-md">
        <div className="m-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <ul className="grid grid-cols-3 p-2">
            {items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center py-3 px-2 gap-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                    isActive(href)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${
                    isActive(href)
                      ? "bg-blue-100 dark:bg-blue-800/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}