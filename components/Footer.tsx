import Link from "next/link";
import Image from "next/image";
import logoPng from "@/app/jaeyguides-logo.png";

export default function Footer() {
  return (
    <footer className="relative px-4 sm:px-6 lg:px-8 py-8 border-t border-border/50 bg-surface/80 backdrop-blur-xl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-50" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          {/* Brand section */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="p-[1px] rounded-md bg-gradient-to-br from-primary via-secondary to-accent">
                <div className="rounded-sm bg-surface p-0.5">
                  <Image src={logoPng} alt="JaeyGuides" width={100} height={20} className="object-contain w-[120px] h-[24px]" />
                </div>
              </div>
              <span className="sr-only">JaeyGuides</span>
            </div>
            <div className="text-muted font-medium">
              © {new Date().getFullYear()} JaeyGuides. All rights reserved.
            </div>
          </div>
          
          {/* Navigation links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              href="/about" 
              className="text-muted hover:text-primary transition-all duration-300 font-medium hover:scale-105 interactive"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-muted hover:text-primary transition-all duration-300 font-medium hover:scale-105 interactive"
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-muted hover:text-primary transition-all duration-300 font-medium hover:scale-105 interactive"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted hover:text-primary transition-all duration-300 font-medium hover:scale-105 interactive"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
        
        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-muted">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>100% Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>Client-Side Processing</span>
            </div>
          </div>
          <div className="text-muted">
            Built with ❤️ for the developer community
          </div>
        </div>
      </div>
    </footer>
  );
}