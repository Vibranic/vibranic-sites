import site from '../../site.config'
import { escapeHtml } from '../../app/utils/richText'
import { absoluteUrl } from '../../app/utils/sections'

// Built from site.config.ts and prerendered to a static sitemap.xml (see nitro.prerender.routes).
// The /design style guide is intentionally left out.
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const pages = [
    { path: '/', lastmod: undefined as string | undefined },
    { path: '/privacy', lastmod: site.privacy.lastUpdated },
  ]

  const urls = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeHtml(absoluteUrl(site.seo.siteUrl, page.path))}</loc>${
          page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''
        }\n  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
