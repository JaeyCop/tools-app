export const metadata = {
  title: "Contact JaeyGuides",
  description: "Get in touch with JaeyGuides for support or feedback.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-300">
        We’d love to hear your feedback and suggestions. For support or partnership inquiries, reach us at:
      </p>
      <p className="text-lg"><a className="text-blue-600 dark:text-blue-400 hover:underline" href="mailto:jaeyguides@gmail.com">jaeyguides@gmail.com</a></p>
      <p className="text-gray-600 dark:text-gray-300">
        We typically respond within 1–2 business days.
      </p>
    </main>
  );
}