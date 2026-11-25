<script setup lang="ts">
const { init } = useTheme()
onMounted(init)
</script>

<template>
  <div>
    <a href="#main" class="sr-only">Skip to content</a>
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
