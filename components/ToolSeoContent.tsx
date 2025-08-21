'use client';

export default function ToolSeoContent({
  title,
  overview,
  steps,
  tips,
  privacyNote,
  faq,
  // new optional props for pages that pass additional content
  howToTitle,
  featuresTitle,
  features,
  useCasesTitle,
  useCases,
  faqTitle,
}: {
  title: string;
  overview: string;
  steps: string[];
  tips?: string[];
  privacyNote?: string;
  faq?: { q: string; a: string }[];
  howToTitle?: string;
  featuresTitle?: string;
  features?: { name: string; description: string }[];
  useCasesTitle?: string;
  useCases?: string[];
  faqTitle?: string;
}) {
  return (
    <section className="mt-16 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">{title}: Overview</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{overview}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">{howToTitle ?? 'How to use'}</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      {features?.length ? (
        <div>
          <h3 className="text-xl font-semibold">{featuresTitle ?? 'Features'}</h3>
          <ul className="mt-2 space-y-3">
            {features.map((f, i) => (
              <li key={i} className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-foreground">{f.name}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {useCases?.length ? (
        <div>
          <h3 className="text-xl font-semibold">{useCasesTitle ?? 'Use Cases'}</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
            {useCases.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {tips?.length ? (
        <div>
          <h3 className="text-xl font-semibold">Tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {privacyNote ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{privacyNote}</p>
      ) : null}

      {faq?.length ? (
        <div>
          <h3 className="text-xl font-semibold">{faqTitle ?? 'FAQ'}</h3>
          <div className="mt-2 space-y-3">
            {faq.map((qa, i) => (
              <details key={i} className="group border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <summary className="cursor-pointer font-medium">{qa.q}</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{qa.a}</p>
              </details>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}