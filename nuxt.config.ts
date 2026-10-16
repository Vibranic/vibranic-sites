// Static brochure-site kit. Content lives in ./site.config.ts, brand in app/assets/css/.
// Build: `npm run generate` → .output/public (deploy that folder to Netlify).
export default defineNuxtConfig({
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
