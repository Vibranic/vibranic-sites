// Static brochure-site kit. Content lives in ./site.config.ts, brand in app/assets/css/.
// Build: `npm run generate` → .output/public (deploy that folder to Netlify).
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/privacy'],
    },
  },
})
