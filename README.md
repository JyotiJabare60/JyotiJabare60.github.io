# Jyoti Jabare — Portfolio

Nuxt 3 portfolio implementing the approved Phase 3 design. Static-generated, file-based content,
no backend, no database, no admin surface.

**Live content is in `content/*.json` — you can update the whole site without touching a component.**

---

## Setup

```bash
npm install          # Node 20+ (built on Node 24, npm 11)
npm run dev          # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production server build → `.output/server` |
| `npm run generate` | **Static site** → `.output/public` (this is what you deploy) |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript check across the app |
| `npm run test:e2e` | Playwright suite (49 tests) against the generated site |
| `node tests/capture.mjs` | Regenerate QA screenshots into `qa-shots/` (server must be running) |

The Playwright config starts its own static server on port 4173, so run `npm run generate` first.

---

## Folder structure

```
portfolio-site/
├── app.vue                     # root
├── error.vue                   # 404 / error page
├── nuxt.config.ts              # SEO defaults, fonts, theme bootstrap, prerender config
├── layouts/default.vue         # header + main + footer
├── pages/
│   ├── index.vue               # home — hero, highlights, featured work, expertise, experience, certs, contact
│   ├── about.vue  experience.vue  skills.vue  certifications.vue  contact.vue
│   └── projects/
│       ├── index.vue           # listing + category filters
│       └── [slug].vue          # case-study route, one per project
├── components/                 # AppHeader, AppFooter, ThemeSwitch, ProjectCard, ProjectMedia,
│                               # ProjectFilters, ProjectGallery, StatRow, SkillGroupCard,
│                               # TimelineList, CertCard, SectionHead, CalloutBox
├── composables/
│   ├── useContent.ts           # typed access to content/*.json
│   ├── useTheme.ts             # light / dark / system, persisted
│   └── usePageSeo.ts           # title, description, canonical, Open Graph
├── content/                    # ← EDIT HERE
│   ├── site.json               # name, contact, availability, nav, asset paths
│   ├── profile.json            # hero, highlights, about, how-I-work
│   ├── projects.json           # every project and case study
│   ├── experience.json         # employment timeline
│   ├── skills.json             # skill groups and honest gaps
│   └── certifications.json     # certificates, awards, delivery record
├── assets/css/
│   ├── tokens.css              # approved design tokens (both themes)
│   └── main.css                # approved component styles
├── public/
│   ├── images/projects/        # approved screenshots only
│   ├── files/                  # put the résumé PDF here
│   └── favicon.ico, apple-touch-icon.png, icon-512.png
├── server/routes/              # sitemap.xml and robots.txt (generated from content)
├── tests/                      # Playwright specs + static server + capture script
└── types/content.ts            # content types
```

---

## Editing content

### Text anywhere on the site
Find it in `content/*.json` and change it. No build config to touch. `experience.json` items allow
inline `<b>` for emphasis; nothing else accepts HTML.

### Adding a project

Append an object to `content/projects.json`. The route `/projects/<slug>` appears automatically, the
listing picks it up, and the filter counts recalculate.

```jsonc
{
  "slug": "my-project",              // becomes /projects/my-project
  "name": "My Project",
  "cardTitle": "Short card heading",
  "categories": ["fullstack"],       // any of: fullstack, flutter, ai
  "categoryLabel": "Full-stack",
  "status": "production",            // published | production | prototype
  "statusLabel": "Production · internal",
  "contribution": "120 / 200 commits",
  "role": "Primary author",
  "period": "2026",
  "scale": "~10,000 lines",
  "employer": "Employer name",
  "summary": "Card description, 2–3 sentences.",
  "tags": ["Vue 3", "Node.js"],
  "media": { "kind": "plate", "plateName": "My Project",
             "plateStack": ["Vue 3", "Node"], "plateNote": "No public screenshot · internal product" },
  "featured": false,                 // true puts it on the home page
  "order": 12,
  "lead": "One-line intro on the case-study page.",
  "sections": [{ "heading": "Overview", "body": ["..."], "list": ["..."] }],
  "gallery": [],
  "noAssetsNote": "Required when media.kind is 'plate'.",
  "outcomes": ["Verified outcome"],
  "stack": ["Vue 3"],
  "platforms": "Web"
}
```

Two rules the tests enforce: a project with a `plate` must carry a `noAssetsNote` and must have an
empty gallery, and every referenced image must be in the approved list in `tests/assets.spec.ts`.

### Replacing or adding screenshots

1. **Review the image first.** Screens showing customer names, phone numbers, email addresses or
   addresses must not be published. Three HomeFoody screens were excluded for exactly this reason,
   and the order list on the dashboard has its names blurred.
2. Resize to ~760px wide and save as JPEG, quality ~86:
   ```bash
   convert source.png -resize 760x -strip -quality 86 \
     public/images/projects/<project>/07-new-screen.jpg
   ```
3. Add it to the project's `gallery` in `content/projects.json` with `src`, `alt`, `caption`, and the
   real `w`/`h` (`identify -format "%w %h" <file>`).
4. Add the path to `APPROVED` in `tests/assets.spec.ts` — the privacy guard fails the build otherwise.
5. To turn a plate into a screenshot card, replace the project's `media` with
   `{ "kind": "screenshot", "src": "...", "alt": "...", "badge": "Published app", "w": 760, "h": 1216 }`.

### Adding certificate verification links

In `content/certifications.json`, set `verifyUrl` to the public `ude.my` URL. The "Verify certificate"
link only renders when that field is set, so there are never dead links.

### Adding the résumé

1. Put the PDF at `public/files/jyoti-jabare-resume.pdf`.
2. Set `"resumePdf": "/files/jyoti-jabare-resume.pdf"` in `content/site.json`.

The Résumé button in the header, the hero download button and the contact-page link all appear
automatically. While the field is `null` they stay hidden — no non-functional buttons.

The same pattern applies to `profilePhoto`, `githubUrl` and `ogImage` in `content/site.json`.

---

## Themes

Light, dark and system, with system as the default. The chosen mode is stored under `jj-theme` in
`localStorage` and applied by an inline script in `<head>` before first paint, so there is no flash.
Tokens live in `assets/css/tokens.css`; dark mode is a designed set of values, not an inversion.

---

## SEO

- Per-page title, description, canonical URL and Open Graph tags via `usePageSeo()`.
- `Person` structured data on the home page.
- `/sitemap.xml` and `/robots.txt` are generated from content at build time.
- **Set the domain before publishing:** `NUXT_PUBLIC_SITE_URL=https://yourdomain.com npm run generate`.
  Until then it falls back to a placeholder, and canonical/OG URLs use that placeholder.

---

## Deploying to GitHub Pages (free, no domain needed)

A workflow is already committed at `.github/workflows/deploy.yml`. It takes the site URL from your
Pages settings, so nothing is hard-coded and it works whether the site lives at the root of
`<username>.github.io` or under a project subpath.

1. Repository: **`JyotiJabare60.github.io`** (already created) → serves at
   **https://jyotijabare60.github.io** (Pages URLs are lower-cased).
2. Push this folder to it:
   ```bash
   git init && git add . && git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/JyotiJabare60/JyotiJabare60.github.io.git
   git push -u origin main
   ```
3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow runs on every push to `main` and publishes `.output/public`.

Notes:
- The free tier requires a **public** repository. The source is yours — no employer code is in it —
  but the twelve approved screenshots become publicly visible, which is already their intended state.
- For a project repo (`github.com/<username>/portfolio`) the site is served from `/portfolio/`.
  That works: `actions/configure-pages` sets `NUXT_APP_BASE_URL`, and every asset path goes through
  `useAssetUrl()` so images and downloads pick up the prefix. Verified in both shapes.
- `assets.githubUrl` is set to `https://github.com/JyotiJabare60`, so the contact page and the
  `Person` structured data link to the profile.
- Commits in this repo use the personal identity `jyotijabare60@gmail.com`, not the work address.

Alternatives if you would rather keep the source private: Cloudflare Pages (`*.pages.dev`) or
Netlify (`*.netlify.app`) — both free, both accept `.output/public` directly.

## Deployment preparation

The site is fully static — `npm run generate` produces `.output/public`, which any static host serves
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, or nginx).

```bash
NUXT_PUBLIC_SITE_URL=https://yourdomain.com npm run generate
npx serve .output/public      # local check
```

Before going live:

- [ ] Set `NUXT_PUBLIC_SITE_URL` to the real domain
- [ ] Add the résumé PDF and the two certificate verification URLs
- [ ] Add a personal GitHub URL in `content/site.json`
- [ ] Add a social preview image (`ogImage`) — 1200×630
- [ ] Re-run `npm run test:e2e`

**No deployment or domain purchase has been performed.**
