export default function TermsPage() {
  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-700 to-slate-700 dark:from-zinc-200 dark:to-slate-200 bg-clip-text text-transparent">Terms of Service</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Please read these terms carefully before using the site.</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

          <h2>2. Local Processing</h2>
          <p>All tools run entirely in your browser using Web APIs. Files are not uploaded to a remote server unless explicitly stated.</p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Ensure you have the right to process the files you upload.</li>
            <li>Do not use the tools for unlawful purposes.</li>
            <li>Back up important data. We are not responsible for data loss.</li>
          </ul>

          <h2>4. No Warranties</h2>
          <p>The tools are provided “as is” without warranties of any kind. We do not warrant that the site will be error‑free or uninterrupted.</p>

          <h2>5. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the tools.</p>

          <h2>6. Changes to the Terms</h2>
          <p>We may update these Terms from time to time. Your continued use of the site constitutes acceptance of any changes.</p>

          <h2>7. Contact</h2>
          <p>If you have questions about these Terms, please contact us.</p>
        </div>
      </div>
    </div>
  );
}
