<script setup lang="ts">
import type { Certification } from '~/types/content'
defineProps<{ cert: Certification }>()
</script>

<template>
  <div class="cert">
    <div class="cert-mark">{{ cert.monogram }}</div>
    <div>
      <h3>{{ cert.title }}</h3>
      <p class="muted">{{ cert.issuer }}</p>
      <!-- link appears only when a verification URL has been supplied -->
      <p v-if="cert.verifyUrl" style="margin-top:var(--s2)">
        <a class="verify" :href="cert.verifyUrl" target="_blank" rel="noopener noreferrer">Verify certificate</a>
      </p>
    </div>
  </div>
</template>
