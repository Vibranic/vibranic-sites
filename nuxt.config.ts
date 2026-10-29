import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Static brochure-site kit. Content lives in ./site.config.ts, brand in app/assets/css/.
// Build: `npm run generate` → .output/public (deploy that folder to Netlify).
//
// One repo, several sites: SITE=<name> builds sites/<name>.config.ts instead
// (e.g. SITE=vibranic for vibranic.be). Without SITE it builds ./site.config.ts (the demo).
const siteName = process.env.SITE?.trim()
const siteConfigPath = fileURLToPath(
  new URL(siteName ? `./sites/${siteName}.config.ts` : './site.config.ts', import.meta.url),
)
if (!existsSync(siteConfigPath)) {
  throw new Error(`SITE=${siteName}: ${siteConfigPath} does not exist`)
}

export default defineNuxtConfig({
  // `#site` = the active site config (app + server routes import it through this alias).
  alias: { '#site': siteConfigPath },
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  ssr: true,
  modules: ['@nuxt/image'],
  // Photos are resized at BUILD time (ipx writes the variants into .output/public/_ipx),
  // so a 4000px phone shot is fine in site.config.ts: visitors only download small webp files.
  image: {
    quality: 72,
    format: ['webp'],
    // Breakpoints for the `sizes` prop of <NuxtImg>, mobile-first: "xs:100vw md:50vw" = 100vw below md, 50vw from md up.
    // md matches the 56rem layout switch.
    screens: { xs: 360, sm: 480, md: 896, lg: 1280, xl: 1600 },
  },
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/privacy', '/sitemap.xml', '/robots.txt'],
    },
  },
})
