import ResponsiveSidebar from "@/components/Nav";
import TopBar from "@/components/TopBar";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import { metadata } from "./metadata";
import AppThemeProvider from "@/components/AppThemeProvider";
import Script from "next/script";
import SeoOrganizationJsonLd from "@/components/SeoOrganizationJsonLd";
import { CommandPalette } from "@/components/CommandPalette";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4856673905187091'}
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        {/* AdSense Auto Ads (recommended snippet, head, prod only) */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle-init"
            strategy="beforeInteractive"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4856673905187091'}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased font-sans h-full bg-background text-foreground">
        <AppThemeProvider>
          {/* Ahrefs Analytics (prod only, opt-in via env) */}
          {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_AHREFS_KEY && (
            <Script
              id="ahrefs-analytics"
              src="https://analytics.ahrefs.com/analytics.js"
              data-key={process.env.NEXT_PUBLIC_AHREFS_KEY}
              strategy="afterInteractive"
            />
          )}
          <div className="flex h-screen bg-background">
            {/* Organization & WebSite JSON-LD */}
            <SeoOrganizationJsonLd />
            {/* Responsive Sidebar */}
            <ResponsiveSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden lg:ml-80">
              <TopBar />
              <div className="flex-1 overflow-y-auto bg-background">
                <div className="min-h-[calc(100vh-4rem)] flex flex-col">
                  <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                  </div>
                  <Footer />
                </div>
              </div>
            </main>
          </div>

          <Analytics />
          <CommandPalette />
        </AppThemeProvider>
      </body>
    </html>
  );
}