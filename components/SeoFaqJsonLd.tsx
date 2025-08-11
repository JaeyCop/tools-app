'use client';

import Script from 'next/script';

export type FaqItem = { question: string; answer: string };

export default function SeoFaqJsonLd({ items, id }:{ items: FaqItem[]; id: string }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  };
  return (
    <Script id={`faq-${id}`} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(json)}
    </Script>
  );
}