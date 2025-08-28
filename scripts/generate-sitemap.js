const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const OUT_FILE = path.join(__dirname, '..', 'public', 'sitemap.xml');
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaeyguides.com';

function isPageFile(name) {
    return [
        'page.js', 'page.jsx', 'page.ts', 'page.tsx'
    ].includes(name);
}

async function walk(dir, relative = '') {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    let pages = [];
    for (const entry of entries) {
        if (entry.isDirectory()) {
            // skip certain folders
            if (entry.name.startsWith('_') || entry.name === 'components' || entry.name === 'api' || entry.name === 'styles') continue;
            pages = pages.concat(await walk(path.join(dir, entry.name), path.join(relative, entry.name)));
        } else if (entry.isFile()) {
            if (isPageFile(entry.name)) {
                const relPath = relative || '/';
                pages.push({ file: path.join(dir, entry.name), route: relPath });
            }
        }
    }
    return pages;
}

function routeToUrl(route) {
    if (route === '/' || route === '') return `${BASE_URL}/`;
    // normalize windows slashes
    const p = route.replace(/\\/g, '/');
    return `${BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`.replace(/\\/g, '/');
}

function priorityFor(route) {
    if (route === '/' || route === '') return '1.0';
    if (route.startsWith('/blog') || route.startsWith('blog')) return '0.9';
    if (route.startsWith('/guides') || route.startsWith('guides')) return '0.9';
    if (route.startsWith('/pdf') || route.startsWith('image') || route.startsWith('/image')) return '0.8';
    return '0.5';
}

(async function main() {
    try {
        const pages = await walk(APP_DIR);
        // dedupe routes
        const uniq = Array.from(new Map(pages.map(p => [p.route.replace(/\\\\/g, '/'), p])).values());

        const lastmod = new Date().toISOString().split('T')[0];

        const urls = uniq
            .map(p => p.route)
            .sort((a, b) => (a === '/' ? -1 : a.localeCompare(b)))
            .map(route => {
                const loc = routeToUrl(route);
                const priority = priorityFor(route);
                return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
            })
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        await fs.promises.mkdir(path.dirname(OUT_FILE), { recursive: true });
        await fs.promises.writeFile(OUT_FILE, xml, 'utf8');
        console.log('Sitemap generated at', OUT_FILE);
    } catch (err) {
        console.error('Failed to generate sitemap', err);
        process.exitCode = 1;
    }
})();
