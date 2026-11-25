<script setup lang="ts">
import type { SkillGroup } from '~/types/content'
defineProps<{ group: SkillGroup }>()
</script>

<template>
  <div class="exp-group">
    <h3>{{ group.title }}</h3>
    <ul class="tags">
      <li v-for="t in group.tags" :key="t" class="tag">{{ t }}</li>
    </ul>
    <p class="exp-note">{{ group.note }}</p>
  </div>
</template>
