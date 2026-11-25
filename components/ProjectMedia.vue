<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'
defineProps<{ media: ProjectMedia; eager?: boolean }>()
const assetUrl = useAssetUrl()
</script>

<template>
  <!-- A real screenshot is shown as a screenshot; a product with no publishable imagery
       gets the designed plate. Never a fabricated app mockup. -->
  <div v-if="media.kind === 'screenshot' && media.src" class="shot">
    <span v-if="media.badge" class="shot-badge">{{ media.badge }}</span>
    <img :src="assetUrl(media.src)" :alt="media.alt || ''" :loading="eager ? 'eager' : 'lazy'" decoding="async" :width="media.w" :height="media.h">
  </div>

  <div v-else class="plate">
    <span class="plate-note">{{ media.plateNote }}</span>
    <span class="plate-name">{{ media.plateName }}</span>
    <span class="plate-stack">
      <template v-for="(s, i) in media.plateStack" :key="s">
        <span>{{ s }}</span><span v-if="i < (media.plateStack!.length - 1)">·</span>
      </template>
    </span>
  </div>
</template>
