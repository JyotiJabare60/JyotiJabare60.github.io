<script setup lang="ts">
import type { GalleryImage } from '~/types/content'
defineProps<{ images: GalleryImage[]; note?: string | null }>()
const assetUrl = useAssetUrl()
</script>

<template>
  <div>
    <p v-if="note" class="mono faint">{{ note }}</p>
    <div class="gallery">
      <figure v-for="img in images" :key="img.src">
        <img :src="assetUrl(img.src)" :alt="img.alt" loading="lazy" decoding="async" :width="img.w" :height="img.h">
        <figcaption>{{ img.caption }}</figcaption>
      </figure>
    </div>
  </div>
</template>
