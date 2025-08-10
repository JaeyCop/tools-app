import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Analytics from "@/components/Analytics";

// Using system fonts to allow offline builds

export const metadata: Metadata = {
  title: {
    default: "Simple Tools — PDF & Image Utilities",
    template: "%s — Simple Tools",
  },
  description: "Fast, private, in‑browser PDF and image tools.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Simple Tools — PDF & Image Utilities",
    description: "Fast, private, in‑browser PDF and image tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans`}>
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Simple Tools
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/pdf/merge" className="hover:underline">
                PDF Merge
              </Link>
              <Link href="/pdf/split" className="hover:underline">
                PDF Split
              </Link>
              <Link href="/pdf/to-images" className="hover:underline">
                PDF → Images
              </Link>
              <Link href="/pdf/compress" className="hover:underline">
                PDF Compress
              </Link>
              <Link href="/image/resize" className="hover:underline">
                Image Resize
              </Link>
              <Link href="/image/to-pdf" className="hover:underline">
                Images → PDF
              </Link>
              <Link href="/image/convert" className="hover:underline">
                Convert
              </Link>
              <Link href="/image/compress" className="hover:underline">
                Compress
              </Link>
              <Link href="/image/remove-bg" className="hover:underline">
                Remove BG
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
