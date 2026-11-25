<script setup lang="ts">
const site = useSite()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p>© {{ year }} {{ site.name }} · {{ site.location }}</p>
      <p>{{ site.availability }}</p>
    </div>
  </footer>
</template>
