export const metadata = {
  title: "About JaeyGuides",
  description: "Learn about JaeyGuides — privacy-first PDF and image tools that run in your browser.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">About JaeyGuides</h1>
      <p className="text-gray-600 dark:text-gray-300">
        JaeyGuides provides fast, private, and free tools for working with PDFs and images. Everything runs locally in your browser — no files are uploaded or stored on servers.
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Our goal is to keep simple daily tasks simple: merge and split PDFs, resize and convert images, and more — all with a clean interface that works on any device.
      </p>
      <h2 className="text-xl font-semibold">Why trust JaeyGuides?</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
        <li>Privacy-first: processing happens in your browser</li>
        <li>No sign-up required</li>
        <li>Optimized for speed and accessibility</li>
      </ul>
    </main>
  );
}