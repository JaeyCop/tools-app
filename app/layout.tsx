'use client';

import ResponsiveSidebar from "@/components/Nav";
import TopBar from "@/components/TopBar";
import MobileTabs from "@/components/MobileTabs";
import "./globals.css";
import Analytics from "@/components/Analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Simple Tools — PDF & Image Utilities</title>
        <meta name="description" content="Fast, private, in-browser PDF and image tools. Merge PDFs, resize images, convert formats, and more - all processed locally in your browser." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans h-full bg-background text-foreground">
        <TopBar />
        <div className="grid lg:grid-cols-[auto_1fr] h-[100dvh] lg:h-screen relative pt-16 lg:pt-0">
          {/* Responsive Sidebar */}
          <ResponsiveSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <div className="min-h-full p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <MobileTabs />

        <Analytics />
      </body>
    </html>
  );
}