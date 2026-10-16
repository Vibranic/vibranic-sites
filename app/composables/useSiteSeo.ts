import { absoluteUrl } from '~/utils/sections'
import { stripAccent } from '~/utils/richText'

/** Title, description, Open Graph, Twitter card and canonical URL for one page. */
export function useSiteSeo(options: { title?: string; description?: string; path?: string } = {}) {
  const { site, t } = useSite()
  const { seo } = site

  const title = stripAccent(options.title ?? t(seo.title))
  const description = stripAccent(options.description ?? t(seo.description))
  const url = absoluteUrl(seo.siteUrl, options.path ?? '/')
  const image = seo.ogImage ? absoluteUrl(seo.siteUrl, seo.ogImage) : undefined

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogLocale: 'nl_BE',
    ogSiteName: site.business.name,
    ogImage: image,
    twitterCard: image ? 'summary_large_image' : 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })
}
