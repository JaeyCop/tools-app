import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} JaeyGuides
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
          <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
          <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
          <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
          <a href="mailto:jaeyguides@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">jaeyguides@gmail.com</a>
        </nav>
      </div>
    </footer>
  );
}