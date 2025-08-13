import type { Metadata } from "next";
import ogImage from "./jaeyguides-social.png";
import faviconPng from "./favicon.png";

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
    images: [
      {
        url: ogImage.src,
      },
    ],
  },
  alternates: { canonical: "https://jaeyguides.com" },
  twitter: {
    card: "summary_large_image",
    title: "JaeyGuides — PDF & Image Utilities",
    description: "Fast, private, in-browser PDF and image tools.",
    images: [ogImage.src],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon" },
      { url: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
      { url: faviconPng.src, rel: "icon", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};