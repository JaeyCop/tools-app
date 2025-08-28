'use client';

import Script from 'next/script';

export type HowToStep = { name: string; text?: string };

export default function SeoHowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text ?? s.name })),
  };
  return (
    <Script id={`howto-${name.replace(/\s+/g, '-').toLowerCase()}`} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(json)}
    </Script>
  );
}