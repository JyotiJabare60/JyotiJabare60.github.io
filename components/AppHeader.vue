<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const site = useSite()
const route = useRoute()
const assetUrl = useAssetUrl()
const open = ref(false)
watch(() => route.fullPath, () => { open.value = false })

const isCurrent = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <NuxtLink class="brand" to="/">{{ site.name }}<span>.</span></NuxtLink>

      <ul class="nav-links">
        <li v-for="item in site.nav" :key="item.to">
          <NuxtLink :to="item.to" :aria-current="isCurrent(item.to) ? 'page' : undefined">{{ item.label }}</NuxtLink>
        </li>
      </ul>

      <div class="nav-actions">
        <ThemeSwitch />
        <!-- Rendered only when the PDF exists: no dead download buttons -->
        <a v-if="site.assets.resumePdf" class="btn btn-secondary btn-sm" :href="assetUrl(site.assets.resumePdf)" download>Résumé</a>
        <button class="nav-toggle" :aria-expanded="open" aria-controls="nav-panel" type="button" @click="open = !open">
          <span class="sr-only">Menu</span>
          <Menu :size="18" aria-hidden="true" />
        </button>
      </div>
    </div>

    <nav id="nav-panel" class="nav-panel" :data-open="open">
      <ul>
        <li v-for="item in site.nav.slice(1)" :key="item.to">
          <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
