import projectsData from '~/content/projects.json'

export default defineEventHandler((event) => {
  const base = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)

  const staticRoutes = ['/', '/about', '/experience', '/projects', '/skills', '/certifications', '/contact']
  const projectRoutes = (projectsData.projects as { slug: string }[]).map((p) => `/projects/${p.slug}`)

  const urls = [...staticRoutes, ...projectRoutes]
    .map((path) => {
      const priority = path === '/' ? '1.0' : path.startsWith('/projects/') ? '0.7' : '0.8'
      return `  <url>\n    <loc>${base}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
