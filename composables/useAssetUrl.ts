import { joinURL } from 'ufo'

/**
 * Prefixes a content-declared asset path with the app's base URL.
 * Content JSON stores plain paths like /images/projects/x.jpg; this keeps them correct
 * when the site is served from a subpath (e.g. a GitHub Pages project repo at /portfolio/).
 */
export const useAssetUrl = () => {
  const base = useRuntimeConfig().app.baseURL || '/'
  return (path?: string | null) => (path ? joinURL(base, path) : undefined)
}
