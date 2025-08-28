import { MetadataRoute } from 'next'

export async function GET() {
  const baseUrl = 'https://jaeyguides.com'
  const currentDate = new Date().toISOString()

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/sitemap',
    '/workflow',
    '/pdf',
    '/pdf/merge',
    '/pdf/split', 
    '/pdf/compress',
    '/pdf/to-images',
    '/image',
    '/image/resize',
    '/image/convert',
    '/image/compress',
    '/image/to-pdf',
    '/guides',
    '/guides/pdf-accessibility',
    '/guides/batch-pdf-processing',
    '/guides/pdf-security',
    '/guides/image-compression-advanced',
    '/guides/color-management',
    '/guides/web-image-optimization',
    '/guides/document-workflows',
    '/guides/quality-control',
    '/guides/file-organization',
    '/guides/document-security',
    '/guides/privacy-first-processing',
    '/guides/gdpr-compliance',
    '/blog',
    '/blog/pdf-optimization-guide',
    '/blog/image-formats-explained',
    '/blog/pdf-accessibility-best-practices',
    '/blog/batch-processing-workflows',
    '/blog/digital-document-security',
    '/blog/image-compression-algorithms'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page === '' ? 'daily' : page.startsWith('/blog') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/blog') || page.startsWith('/guides') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  })
}