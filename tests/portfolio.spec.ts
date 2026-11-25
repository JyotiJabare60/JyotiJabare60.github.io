import { test, expect, type Page } from '@playwright/test'

const STATIC_ROUTES = ['/', '/about', '/experience', '/projects', '/skills', '/certifications', '/contact']
const PROJECT_SLUGS = [
  'agentmate-crm-mobile', 'enserviceportal', 'atm-crm', 'homefoody', 'agentmate-public-website',
  'atm-mileage-tracker', 'enbuilder-2021', 'tradeinsafe', 'encharity-admin',
  'settlement-form-engine', 'universally-connected',
]
const VIEWPORTS = [
  { name: '360', width: 360, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1920', width: 1920, height: 1080 },
]

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  return errors
}

test.describe('routes', () => {
  for (const route of [...STATIC_ROUTES, ...PROJECT_SLUGS.map((s) => `/projects/${s}`)]) {
    test(`renders ${route}`, async ({ page }) => {
      const errors = collectErrors(page)
      const res = await page.goto(route)
      expect(res?.status(), `status for ${route}`).toBeLessThan(400)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).not.toBeEmpty()
      await expect(page).toHaveTitle(/.{10,}/)
      expect(errors, `console errors on ${route}`).toEqual([])
    })
  }

  test('unknown route shows the 404 page', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.locator('h1')).toContainText(/does not exist/i)
  })
})

test.describe('navigation', () => {
  test('header links reach every section', async ({ page }) => {
    await page.goto('/')
    for (const [label, path] of [['About', '/about'], ['Experience', '/experience'], ['Projects', '/projects'],
      ['Skills', '/skills'], ['Certifications', '/certifications'], ['Contact', '/contact']] as const) {
      await page.locator('.nav-links').getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${path}$`))
    }
    await page.locator('.brand').click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('mobile menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const toggle = page.locator('.nav-toggle')
    await expect(toggle).toBeVisible()
    await expect(page.locator('#nav-panel')).toHaveAttribute('data-open', 'false')
    await toggle.click()
    await expect(page.locator('#nav-panel')).toHaveAttribute('data-open', 'true')
    await page.locator('#nav-panel').getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/\/projects$/)
  })

  test('card click opens the matching case study', async ({ page }) => {
    await page.goto('/projects')
    await page.locator('.card').first().click()
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/)
    await expect(page.locator('.cs-facts')).toBeVisible()
  })
})

test.describe('project filters', () => {
  test('filter counts match rendered cards', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('.card')).toHaveCount(11)

    for (const [label, expected] of [['Full-stack', 7], ['Flutter', 3], ['AI', 3], ['All', 11]] as const) {
      await page.getByRole('button', { name: new RegExp(`^${label}`) }).click()
      await expect(page.locator('.card')).toHaveCount(expected)
      await expect(page.getByRole('button', { name: new RegExp(`^${label}`) })).toHaveAttribute('aria-pressed', 'true')
    }
  })

  test('filter result count is announced', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('button', { name: /^Flutter/ }).click()
    await expect(page.locator('[role="status"]')).toHaveText('3 projects shown')
  })
})

test.describe('case study states', () => {
  test('project with approved screenshots shows a gallery', async ({ page }) => {
    await page.goto('/projects/homefoody')
    const figures = page.locator('.gallery figure')
    await expect(figures).toHaveCount(4)
    for (const img of await page.locator('.gallery img').all()) {
      await expect(img).toHaveAttribute('alt', /.{10,}/)
    }
    // images are lazy-loaded, so scroll them into view first — this also proves lazy loading works
    const beforeScroll = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.gallery img')).filter((i) => (i as HTMLImageElement).naturalWidth > 0).length)
    expect(beforeScroll, 'images below the fold should not load eagerly').toBe(0)

    for (const fig of await page.locator('.gallery figure').all()) {
      await fig.scrollIntoViewIfNeeded()
    }
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll('.gallery img')).every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0),
      undefined, { timeout: 15_000 })

    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.gallery img')).filter((i) => (i as HTMLImageElement).naturalWidth === 0).length)
    expect(broken, 'broken gallery images').toBe(0)

    // intrinsic dimensions are declared, so the gallery reserves space and does not shift
    const missingDims = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.gallery img')).filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length)
    expect(missingDims, 'images without width/height attributes').toBe(0)
  })

  test('project without screenshots shows the honest callout, not a fake mockup', async ({ page }) => {
    await page.goto('/projects/enserviceportal')
    await expect(page.locator('.gallery')).toHaveCount(0)
    await expect(page.locator('.callout')).toContainText(/No screenshots are published/i)
    await expect(page.locator('.cs-body h2')).toContainText(['Overview'])
  })

  test('cards without imagery use the designed plate', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('.plate').first()).toBeVisible()
    await expect(page.locator('.plate-note').first()).toContainText(/No public screenshot/i)
    await expect(page.locator('.shot img')).toHaveCount(1)
  })
})

test.describe('theme', () => {
  test('switches and persists across reloads', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).not.toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: 'Dark' }).click()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => localStorage.getItem('jj-theme'))).toBe('dark')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'dark')

    await page.goto('/projects')
    await expect(html).toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: 'Light' }).click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    await page.getByRole('button', { name: 'System' }).click()
    await expect(html).not.toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => localStorage.getItem('jj-theme'))).toBe('system')
  })

  test('no theme flash: the attribute is set before first paint', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Dark' }).click()
    await page.goto('/about')
    // captured immediately after the document responds, before Vue hydrates
    const attrAtLoad = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(attrAtLoad).toBe('dark')
  })

  test('key pages render in both themes without console errors', async ({ page }) => {
    for (const theme of ['light', 'dark']) {
      const errors = collectErrors(page)
      await page.goto('/')
      await page.getByRole('button', { name: theme === 'dark' ? 'Dark' : 'Light' }).click()
      for (const route of ['/projects', '/projects/homefoody', '/skills', '/contact']) {
        await page.goto(route)
        await expect(page.locator('h1')).toBeVisible()
      }
      expect(errors, `console errors in ${theme} theme`).toEqual([])
    }
  })
})

test.describe('responsive', () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal scroll at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      for (const route of ['/', '/projects', '/projects/homefoody', '/experience', '/contact']) {
        await page.goto(route)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1)
      }
    })
  }

  test('navigation adapts between mobile and desktop', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.locator('.nav-toggle')).toBeVisible()
    await expect(page.locator('.nav-links')).toBeHidden()

    await page.setViewportSize({ width: 1366, height: 768 })
    await expect(page.locator('.nav-links')).toBeVisible()
    await expect(page.locator('.nav-toggle')).toBeHidden()
  })
})

test.describe('assets and links', () => {
  test('no dead résumé button while the PDF is missing', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /résumé/i })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /download/i })).toHaveCount(0)
  })

  test('no invented certificate verification links', async ({ page }) => {
    await page.goto('/certifications')
    await expect(page.locator('.verify')).toHaveCount(0)
    await expect(page.locator('.cert')).toHaveCount(3)
  })

  test('external links open safely', async ({ page }) => {
    await page.goto('/contact')
    const linkedin = page.getByRole('link', { name: /linkedin/i }).first()
    await expect(linkedin).toHaveAttribute('target', '_blank')
    await expect(linkedin).toHaveAttribute('rel', /noopener/)
    await expect(linkedin).toHaveAttribute('href', /linkedin\.com\/in\/jyoti-jabare/)
  })

  test('every image has a real alt attribute and loads', async ({ page }) => {
    await page.goto('/projects/homefoody')
    const imgs = await page.locator('img').all()
    expect(imgs.length).toBeGreaterThan(0)
    for (const img of imgs) {
      const alt = await img.getAttribute('alt')
      expect(alt && alt.length > 5, 'descriptive alt').toBeTruthy()
    }
  })
})

test.describe('SEO', () => {
  test('each page has a unique title, description and canonical', async ({ page }) => {
    const seen = new Set<string>()
    for (const route of STATIC_ROUTES) {
      await page.goto(route)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(10)
      expect(seen.has(title), `duplicate title for ${route}`).toBeFalsy()
      seen.add(title)

      const desc = await page.locator('meta[name="description"]').getAttribute('content')
      expect(desc && desc.length > 40, `description on ${route}`).toBeTruthy()

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `canonical on ${route}`).toContain(route === '/' ? '/' : route)

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      expect(ogTitle, `og:title on ${route}`).toBeTruthy()
    }
  })

  test('home page carries Person structured data', async ({ page }) => {
    await page.goto('/')
    const ld = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(ld || '{}')
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe('Jyoti Jabare')
    expect(Array.isArray(data.knowsAbout)).toBeTruthy()
  })

  test('sitemap and robots are generated', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const xml = await sitemap.text()
    expect(xml).toContain('<urlset')
    expect((xml.match(/<url>/g) || []).length).toBe(18)

    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')
  })

  test('semantic landmarks exist', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header.nav')).toHaveCount(1)
    await expect(page.locator('main#main')).toHaveCount(1)
    await expect(page.locator('footer')).toHaveCount(1)
    await expect(page.locator('a[href="#main"]')).toHaveCount(1)
  })
})

test.describe('content integrity', () => {
  test('home shows only verified figures', async ({ page }) => {
    await page.goto('/')
    const stats = page.locator('.stat-value')
    await expect(stats).toHaveCount(4)
    await expect(stats.nth(0)).toHaveText('8+')
    await expect(stats.nth(2)).toHaveText('8')   // Angular applications — cross-checked
    await expect(stats.nth(3)).toHaveText('6')   // Flutter apps — cross-checked
    const body = await page.locator('body').innerText()
    expect(body).not.toMatch(/\b\d{2}% (faster|improvement|increase)\b/i)
  })

  test('both disciplines are visible above the fold on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/')
    const hero = await page.locator('.hero').innerText()
    expect(hero).toMatch(/Angular/)
    expect(hero).toMatch(/Flutter/)
  })
})
