import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-6 border-t border-border bg-surface/70 backdrop-blur">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="text-muted">
          © {new Date().getFullYear()} JaeyGuides
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-muted hover:text-primary transition-colors">About</Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href="/contact" className="text-muted hover:text-primary transition-colors">Contact</Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href="/privacy" className="text-muted hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href="/terms" className="text-muted hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}