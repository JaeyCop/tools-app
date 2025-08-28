'use client';

import Script from 'next/script';

export type FaqItem = { question: string; answer: string };

type LegacyQuestion = { q: string; a: string };

export default function SeoFaqJsonLd({ items, questions, id }: {
  items?: FaqItem[];
  questions?: LegacyQuestion[];
  id?: string;
}) {
  // normalize either `items` or legacy `questions` prop
  const normalized: FaqItem[] = items ?? (questions ? questions.map((qq) => ({ question: qq.q, answer: qq.a })) : []);
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: normalized.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  };
  const scriptId = id ?? 'faq-jsonld';
  return (
    <Script id={scriptId} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(json)}
    </Script>
  );
}