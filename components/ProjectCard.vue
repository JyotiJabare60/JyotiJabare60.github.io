<script setup lang="ts">
import type { Project } from '~/types/content'
defineProps<{ project: Project; eager?: boolean }>()
</script>

<template>
  <NuxtLink class="card reveal is-in" :to="`/projects/${project.slug}`">
    <ProjectMedia :media="project.media" :eager="eager" />
    <div class="card-body">
      <div class="card-head">
        <span class="chip-cat">{{ project.categoryLabel }}</span>
        <span class="card-role mono">{{ project.contribution }}</span>
      </div>
      <h3>{{ project.cardTitle }}</h3>
      <p>{{ project.summary }}</p>
      <ul class="tags">
        <li v-for="t in project.tags" :key="t" class="tag">{{ t }}</li>
      </ul>
      <div class="card-foot">
        <span class="card-role">{{ project.role }}</span>
        <span class="card-cta">View case study</span>
      </div>
    </div>
  </NuxtLink>
</template>
