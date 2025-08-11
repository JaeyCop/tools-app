'use client';

import Script from 'next/script';

export default function SeoOrganizationJsonLd() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JaeyGuides',
    url: 'https://jaeyguides.com',
    sameAs: [],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JaeyGuides',
    url: 'https://jaeyguides.com',
  };

  return (
    <>
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(org)}
      </Script>
      <Script id="website-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(website)}
      </Script>
    </>
  );
}