import site from '#site'
import { absoluteUrl } from '../../app/utils/sections'

// Prerendered to a static robots.txt: allow everything and point to the sitemap.
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(site.seo.siteUrl, '/sitemap.xml')}\n`
})
