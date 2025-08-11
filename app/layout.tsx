import ResponsiveSidebar from "@/components/Nav";
import "./globals.css";
import Analytics from "@/components/Analytics";
export { metadata } from "./metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased font-sans h-full bg-background text-foreground">
        <div className="grid lg:grid-cols-[auto_1fr] min-h-[100dvh] relative">
          {/* Responsive Sidebar */}
          <ResponsiveSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full p-4 pt-16 sm:p-6 lg:p-8 lg:pt-8">
              {children}
            </div>
          </main>
        </div>

        <Analytics />
      </body>
    </html>
  );
}