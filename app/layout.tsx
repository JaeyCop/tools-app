import ResponsiveSidebar from "@/components/Nav";
import TopBar from "@/components/TopBar";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import { metadata } from "./metadata";
import AppThemeProvider from "@/components/AppThemeProvider";

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <AppThemeProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Responsive Sidebar */}
          <ResponsiveSidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden lg:ml-80">
            <TopBar />
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
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