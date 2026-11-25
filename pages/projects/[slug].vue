<script setup lang="ts">
const route = useRoute()
const site = useSite()
const { bySlug, all } = useProjects()

const project = bySlug(route.params.slug as string)
if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

usePageSeo({
  title: `${project!.name} — case study · Jyoti Jabare`,
  description: project!.summary,
  path: `/projects/${project!.slug}`,
  image: project!.media.kind === 'screenshot' ? project!.media.src : site.assets.ogImage,
  type: 'article',
})

const facts = computed(() => [
  { term: 'My role', detail: project!.role },
  { term: 'Contribution', detail: project!.contribution },
  { term: 'Scale', detail: project!.scale },
  { term: 'Period', detail: project!.period },
])
</script>

<template>
  <div v-if="project">
    <section class="cs-hero">
      <div class="container">
        <p class="eyebrow">
          <NuxtLink to="/projects" style="color:inherit;text-decoration:none">Projects</NuxtLink>
          → {{ project.categoryLabel }} · {{ project.statusLabel }}
        </p>
        <h1 class="cs-title">{{ project.name }} — {{ project.cardTitle.toLowerCase() }}</h1>
        <p class="lead">{{ project.lead }}</p>
        <dl class="cs-facts">
          <div v-for="f in facts" :key="f.term" class="cs-fact">
            <dt>{{ f.term }}</dt><dd>{{ f.detail }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="container cs-layout">
        <div class="cs-body">
          <template v-for="s in project.sections" :key="s.heading">
            <h2>{{ s.heading }}</h2>
            <p v-for="(para, i) in (s.body || [])" :key="i">{{ para }}</p>
            <ul v-if="s.list && s.list.length">
              <li v-for="(li, i) in s.list" :key="i">{{ li }}</li>
            </ul>
          </template>

          <h2>Screenshots</h2>
          <ProjectGallery
            v-if="project.gallery.length"
            :images="project.gallery"
            :note="project.galleryNote"
          />
          <CalloutBox v-else><b>No screenshots are published for this project.</b> {{ project.noAssetsNote }}</CalloutBox>

          <h2>Verified outcomes</h2>
          <ul>
            <li v-for="(o, i) in project.outcomes" :key="i">{{ o }}</li>
          </ul>
          <CalloutBox v-if="project.outcomeNote">{{ project.outcomeNote }}</CalloutBox>
        </div>

        <aside class="cs-aside">
          <h3>Stack</h3>
          <ul class="tags">
            <li v-for="t in project.stack" :key="t" class="tag">{{ t }}</li>
          </ul>
          <h3 style="margin-top:var(--s5)">Platforms</h3>
          <p class="mono faint">{{ project.platforms }}</p>
          <h3 style="margin-top:var(--s5)">Employer</h3>
          <p class="mono faint">{{ project.employer }}</p>
          <h3 style="margin-top:var(--s5)">Next</h3>
          <p><NuxtLink class="btn-ghost" to="/projects">← All projects</NuxtLink></p>
        </aside>
      </div>
    </section>
  </div>
</template>
