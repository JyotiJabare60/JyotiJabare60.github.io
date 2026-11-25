// Nuxt 3 configuration — Jyoti Jabare portfolio
// Styling intentionally uses the approved Phase 3 CSS token architecture (CSS custom properties)
// rather than Tailwind, so the implementation cannot drift from the approved design.
const themeBootstrap = `(function(){try{var m=localStorage.getItem('jj-theme')||'system';if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-25',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/tokens.css', '~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Configurable until the personal domain is decided — override with NUXT_PUBLIC_SITE_URL
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://jyotijabare.example',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0C6E68' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap',
        },
      ],
      // Applied before first paint so the chosen theme never flashes
      script: [{ innerHTML: themeBootstrap, tagPosition: 'head' }],
    },
  },

  nitro: {
    prerender: { crawlLinks: true, routes: ['/', '/sitemap.xml', '/robots.txt'], failOnError: false },
  },

  typescript: { strict: true, typeCheck: false },
})
