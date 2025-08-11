import ResponsiveSidebar from "@/components/Nav";
import TopBar from "@/components/TopBar";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import { metadata } from "./metadata";
import AppThemeProvider from "@/components/AppThemeProvider";
import Script from "next/script";
import SeoOrganizationJsonLd from "@/components/SeoOrganizationJsonLd";

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
      </head>
      <body className="antialiased font-sans h-full bg-background text-foreground">
        <AppThemeProvider>
          {/* AdSense Auto Ads */}
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
            <Script
              id="adsbygoogle-init"
              strategy="afterInteractive"
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          )}

          {/* Ahrefs Analytics */}
          <Script
            id="ahrefs-analytics"
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="GOToh+/dvpq5cKtZ4424aw"
            strategy="afterInteractive"
          />
          <div className="flex h-screen bg-background">
            {/* Organization & WebSite JSON-LD */}
            <SeoOrganizationJsonLd />
            {/* Responsive Sidebar */}
            <ResponsiveSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden lg:ml-80">
              <TopBar />
              <div className="flex-1 overflow-y-auto bg-background pb-20 lg:pb-0">
                <div className="min-h-full p-4 sm:p-6 lg:p-8">
                  {children}
                </div>

                <Footer />
              </div>
            </main>
          </div>

          <Analytics />
        </AppThemeProvider>
      </body>
    </html>
  );
}