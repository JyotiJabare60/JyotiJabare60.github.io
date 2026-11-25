<script setup lang="ts">
import type { TimelineEntry } from '~/types/content'
defineProps<{ entries: TimelineEntry[] }>()
</script>

<template>
  <div class="timeline">
    <article v-for="e in entries" :key="e.period" class="tl-item">
      <p class="tl-period">{{ e.period }}</p>
      <h3 class="tl-role">{{ e.role }}</h3>
      <p class="tl-org">{{ e.org }}</p>
      <ul v-if="e.items.length" class="tl-list">
        <!-- content is authored in content/experience.json, not user input -->
        <li v-for="(item, i) in e.items" :key="i" v-html="item" />
      </ul>
    </article>
  </div>
</template>
