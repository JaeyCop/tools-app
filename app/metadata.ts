import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "JaeyGuides — PDF & Image Utilities",
    template: "%s — JaeyGuides",
  },
  description: "Fast, private, in-browser PDF and image tools. Merge PDFs, resize images, convert formats, and more - all processed locally in your browser.",
  keywords: ["PDF tools", "image tools", "file converter", "PDF merge", "image resize", "online tools"],
  authors: [{ name: "JaeyGuides" }],
  metadataBase: new URL("https://jaeyguides.com"),
  openGraph: {
    title: "JaeyGuides — PDF & Image Utilities",
    description: "Fast, private, in-browser PDF and image tools.",
    type: "website",
    siteName: "JaeyGuides",
  },
  twitter: {
    card: "summary_large_image",
    title: "JaeyGuides — PDF & Image Utilities",
    description: "Fast, private, in-browser PDF and image tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};