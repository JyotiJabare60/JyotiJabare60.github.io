<script setup lang="ts">
const site = useSite()
const profile = useProfile()
const skills = useSkills()
const certs = useCertifications()
const experience = useExperience()
const { featured } = useProjects()
const assetUrl = useAssetUrl()

usePageSeo({
  title: 'Jyoti Jabare — Senior Full-Stack & Flutter Engineer',
  description: site.tagline,
  path: '/',
  image: site.assets.ogImage,
})

const { public: pub } = useRuntimeConfig()
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.name,
      jobTitle: 'Senior Full-Stack Engineer',
      description: site.tagline,
      email: `mailto:${site.email}`,
      url: pub.siteUrl,
      sameAs: [site.linkedin, site.assets.githubUrl].filter(Boolean),
      address: { '@type': 'PostalAddress', addressLocality: 'Navi Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
      knowsAbout: ['Angular', 'Vue 3', 'Nuxt 3', 'Flutter', 'Dart', 'Node.js', 'MongoDB', 'TypeScript', 'OpenAI API'],
    }),
  }],
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">{{ site.roleLine }}</p>
          <h1>{{ profile.headline }}</h1>
          <p class="lead">{{ profile.heroSummary }}</p>
          <div class="hero-actions">
            <NuxtLink class="btn btn-primary" to="/contact">Get in touch</NuxtLink>
            <a v-if="site.assets.resumePdf" class="btn btn-secondary" :href="assetUrl(site.assets.resumePdf)" download>Download résumé</a>
            <NuxtLink v-else class="btn btn-secondary" to="/projects">View projects</NuxtLink>
          </div>
          <div class="hero-meta">
            <span v-for="m in profile.heroMeta" :key="m.label"><b>{{ m.value }}</b> {{ m.label }}</span>
            <span>{{ site.location.split(',')[0] }} · open to remote</span>
            <span class="avail">{{ site.availability }}</span>
          </div>
        </div>

        <aside class="spec-panel">
          <h2>Technical specialisations</h2>
          <dl>
            <div v-for="s in profile.specialisations" :key="s.term" class="spec-row">
              <dt>{{ s.term }}</dt>
              <dd>{{ s.detail }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>

    <!-- Professional highlights -->
    <section class="section">
      <div class="container">
        <SectionHead eyebrow="Professional highlights" title="Verified delivery, not estimates." />
        <StatRow :stats="profile.highlights" />
        <p class="mono faint" style="margin-top:var(--s4)">{{ profile.highlightsNote }}</p>
      </div>
    </section>

    <!-- Featured projects -->
    <section class="section">
      <div class="container">
        <SectionHead
          eyebrow="Featured work"
          title="Six projects that show the range."
          lead="Mobile and full-stack alternate deliberately — each card states my measured share of the codebase and the hardest problem it contained."
        />
        <div class="cards-2">
          <ProjectCard v-for="(p, i) in featured" :key="p.slug" :project="p" :eager="i < 2" />
        </div>
        <p style="margin-top:var(--s6)"><NuxtLink class="btn btn-secondary" to="/projects">All projects</NuxtLink></p>
      </div>
    </section>

    <!-- Technical expertise -->
    <section class="section">
      <div class="container">
        <SectionHead
          eyebrow="Technical expertise"
          title="Two depths, one stack."
          lead="Angular and Vue on the web, Flutter on mobile, Node and MongoDB underneath both — with the integration and delivery work that makes them production systems."
        />
        <div class="expertise">
          <SkillGroupCard v-for="g in skills.groups" :key="g.title" :group="g" />
        </div>
      </div>
    </section>

    <!-- Professional experience -->
    <section class="section">
      <div class="container">
        <SectionHead eyebrow="Professional experience" title="Eight years, two employers, one direction." />
        <TimelineList :entries="experience.entries.slice(0, 2)" />
        <p style="margin-top:var(--s6)"><NuxtLink class="btn btn-secondary" to="/experience">Full career detail</NuxtLink></p>
      </div>
    </section>

    <!-- Certifications -->
    <section class="section">
      <div class="container">
        <SectionHead eyebrow="Certifications" title="Verifiable, not decorative." />
        <div class="cards-3">
          <CertCard v-for="c in certs.certifications" :key="c.title" :cert="c" />
        </div>
        <CalloutBox style="margin-top:var(--s6)">{{ certs.calloutHome }}</CalloutBox>
      </div>
    </section>

    <!-- Contact -->
    <section class="section">
      <div class="container">
        <SectionHead
          eyebrow="Contact"
          :title="site.availability + '.'"
          lead="Open to senior full-stack, Flutter and technical lead roles — remote or Navi Mumbai based."
        />
        <div class="hero-actions">
          <a class="btn btn-primary" :href="`mailto:${site.email}`">{{ site.email }}</a>
          <a class="btn btn-secondary" :href="site.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <NuxtLink class="btn btn-secondary" to="/contact">Contact form</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
