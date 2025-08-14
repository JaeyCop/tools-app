import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-gray-600 dark:text-gray-300">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link href="/" className="px-4 py-2 rounded-xl bg-blue-600 text-white">Go home</Link>
        <Link href="/pdf/merge" className="px-4 py-2 rounded-xl border">Merge PDFs</Link>
        <Link href="/image/resize" className="px-4 py-2 rounded-xl border">Resize Image</Link>
      </div>
    </main>
  );
}