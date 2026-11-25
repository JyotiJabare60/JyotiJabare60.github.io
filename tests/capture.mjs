// Captures QA evidence screenshots in both themes at the specified breakpoints.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const OUT = 'qa-shots'
mkdirSync(OUT, { recursive: true })

const shots = [
  { route: '/', w: 1366, h: 900, theme: 'light', name: 'home-1366-light' },
  { route: '/', w: 1366, h: 900, theme: 'dark', name: 'home-1366-dark' },
  { route: '/projects', w: 1366, h: 900, theme: 'light', name: 'projects-1366-light' },
  { route: '/projects', w: 1366, h: 900, theme: 'dark', name: 'projects-1366-dark' },
  { route: '/projects/homefoody', w: 1366, h: 900, theme: 'light', name: 'homefoody-1366-light' },
  { route: '/projects/enserviceportal', w: 1366, h: 900, theme: 'dark', name: 'enservice-1366-dark' },
  { route: '/about', w: 1366, h: 900, theme: 'light', name: 'about-1366-light' },
  { route: '/experience', w: 1366, h: 900, theme: 'dark', name: 'experience-1366-dark' },
  { route: '/skills', w: 1366, h: 900, theme: 'light', name: 'skills-1366-light' },
  { route: '/certifications', w: 1366, h: 900, theme: 'dark', name: 'certifications-1366-dark' },
  { route: '/contact', w: 1366, h: 900, theme: 'light', name: 'contact-1366-light' },
  { route: '/', w: 390, h: 844, theme: 'light', name: 'home-390-light' },
  { route: '/', w: 390, h: 844, theme: 'dark', name: 'home-390-dark' },
  { route: '/projects', w: 360, h: 740, theme: 'light', name: 'projects-360-light' },
  { route: '/projects/homefoody', w: 768, h: 1024, theme: 'light', name: 'homefoody-768-light' },
  { route: '/', w: 1920, h: 1080, theme: 'light', name: 'home-1920-light' },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } })
  await ctx.addInitScript(([t]) => { try { localStorage.setItem('jj-theme', t) } catch {} }, [s.theme])
  const page = await ctx.newPage()
  await page.goto(BASE + s.route, { waitUntil: 'networkidle' })
  // force every lazy image to load and finish decoding before the capture
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'))
    imgs.forEach((i) => { i.loading = 'eager'; if (!i.src) i.src = i.dataset.src || i.src })
    await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth > 0)
      ? i.decode().catch(() => {})
      : new Promise((res) => { i.addEventListener('load', () => i.decode().then(res, res), { once: true }); i.addEventListener('error', res, { once: true }) })))
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true })
  console.log('captured', s.name)
  await ctx.close()
}
await browser.close()
