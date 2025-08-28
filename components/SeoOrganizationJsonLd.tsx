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
    url: baseUrl,
    logo: logoUrl,
    image: ogUrl,
    sameAs: [
      'https://twitter.com/jaeyguides',
      'https://github.com/JaeyCop',
      // add other social profiles here
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-000-000-0000',
        contactType: 'customer support',
        areaServed: 'US',
        availableLanguage: ['English'],
      },
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JaeyGuides',
    url: baseUrl,
    publisher: {
      '@type': 'Organization',
      name: 'JaeyGuides',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(org)}
      </Script>
      <Script id="website-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(website)}
      </Script>
      <Script id="breadcrumb-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
    </>
  );
}