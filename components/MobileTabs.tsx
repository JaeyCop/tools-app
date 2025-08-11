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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40">
      <div className="mx-auto max-w-3xl">
        <div className="m-3 rounded-2xl bg-surface/90 dark:bg-surface/80 backdrop-blur-xl border border-border shadow-premium">
          <ul className="grid grid-cols-3">
            {items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center py-2.5 gap-1 rounded-2xl text-xs font-medium transition-all ${
                    isActive(href)
                      ? "text-primary bg-primary/5"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
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