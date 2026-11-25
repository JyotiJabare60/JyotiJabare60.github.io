<script setup lang="ts">
import type { StatTile } from '~/types/content'
defineProps<{ stats: StatTile[] }>()
</script>

<template>
  <div class="stats">
    <div v-for="s in stats" :key="s.label" class="stat">
      <div class="stat-value">{{ s.value }}</div>
      <div class="stat-label">{{ s.label }}</div>
      <div class="stat-note">{{ s.note }}</div>
    </div>
  </div>
</template>
