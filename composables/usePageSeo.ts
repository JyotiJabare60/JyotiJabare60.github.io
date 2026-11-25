interface PageSeo {
  title: string
  description: string
  path: string
  image?: string | null
  type?: 'website' | 'article'
}

/** Page title, description, canonical URL and Open Graph tags. Domain stays configurable. */
export const usePageSeo = ({ title, description, path, image, type = 'website' }: PageSeo) => {
  const { public: pub } = useRuntimeConfig()
  const base = (pub.siteUrl as string).replace(/\/$/, '')
  const url = `${base}${path}`
  const ogImage = image ? `${base}${image}` : undefined

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogSiteName: 'Jyoti Jabare — Portfolio',
    twitterCard: ogImage ? 'summary_large_image' : 'summary',
    twitterTitle: title,
    twitterDescription: description,
    ...(ogImage ? { ogImage, twitterImage: ogImage } : {}),
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })

  return { url, base }
}
