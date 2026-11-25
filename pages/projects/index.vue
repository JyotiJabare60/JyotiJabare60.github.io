<script setup lang="ts">
import type { ProjectCategory } from '~/types/content'

const site = useSite()
const { all, categories } = useProjects()
const active = ref<ProjectCategory | 'all'>('all')

const visible = computed(() =>
  active.value === 'all' ? all : all.filter((p) => p.categories.includes(active.value as ProjectCategory)),
)

usePageSeo({
  title: 'Projects — Jyoti Jabare',
  description: 'Eleven projects across full-stack, Flutter and AI, each with a measured share of the repository.',
  path: '/projects',
  image: site.assets.ogImage,
})
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">Projects</p>
        <h1>Eleven projects, measured not estimated.</h1>
        <p class="lead">
          Every card carries my share of the repository, counted from git history. Products are named with
          permission; internal systems carry no screenshots.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ProjectFilters v-model="active" :categories="categories" :shown="visible.length" />
        <div class="cards-2">
          <ProjectCard v-for="(p, i) in visible" :key="p.slug" :project="p" :eager="i < 2" />
        </div>
      </div>
    </section>
  </div>
</template>
