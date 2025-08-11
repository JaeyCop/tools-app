export default function PrivacyPage() {
  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Your files stay on your device. We value privacy.</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>Local‑first processing</h2>
          <p>All features process files directly in your browser using WebAssembly and Canvas APIs. No files are sent to our servers.</p>

          <h2>What we don’t collect</h2>
          <ul>
            <li>We don’t store your files.</li>
            <li>We don’t track your content.</li>
            <li>We don’t sell your data.</li>
          </ul>

          <h2>Anonymous analytics</h2>
          <p>We may use privacy‑preserving analytics to improve the product. These analytics do not include file contents or personally identifiable data.</p>

          <h2>Your control</h2>
          <p>You can clear generated downloads and revoke object URLs by refreshing your browser tab. For additional control, use your browser’s clear data tools.</p>

          <h2>Contact</h2>
          <p>If you have any privacy concerns, please reach out.</p>
        </div>
      </div>
    </div>
  );
}
