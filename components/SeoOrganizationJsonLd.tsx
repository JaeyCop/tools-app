'use client';

import Script from 'next/script';
import logoPng from '@/app/jaeyguides-logo.png';
import ogPng from '@/app/jaeyguides-social.png';

export default function SeoOrganizationJsonLd() {
  const baseUrl = 'https://jaeyguides.com';
  const logoUrl = `${baseUrl}${logoPng.src}`;
  const ogUrl = `${baseUrl}${ogPng.src}`;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JaeyGuides',
    url: 'https://jaeyguides.com',
    logo: logoUrl,
    image: ogUrl,
    sameAs: [],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JaeyGuides',
    url: 'https://jaeyguides.com',
    publisher: {
      '@type': 'Organization',
      name: 'JaeyGuides',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
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