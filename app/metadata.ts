import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Simple Tools — PDF & Image Utilities",
    template: "%s — Simple Tools",
  },
  description: "Fast, private, in-browser PDF and image tools. Merge PDFs, resize images, convert formats, and more - all processed locally in your browser.",
  keywords: ["PDF tools", "image tools", "file converter", "PDF merge", "image resize", "online tools"],
  authors: [{ name: "Simple Tools" }],
  metadataBase: new URL("https://simple-tools.vercel.app"),
  openGraph: {
    title: "Simple Tools — PDF & Image Utilities",
    description: "Fast, private, in-browser PDF and image tools.",
    type: "website",
    siteName: "Simple Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Tools — PDF & Image Utilities",
    description: "Fast, private, in-browser PDF and image tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};