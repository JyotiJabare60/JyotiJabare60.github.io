<script setup lang="ts">
const site = useSite()
const experience = useExperience()
usePageSeo({
  title: 'Experience — Jyoti Jabare',
  description: 'Eight years across NU App Solutions and NeoSoft Technologies, with measured contribution per project.',
  path: '/experience',
  image: site.assets.ogImage,
})
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">Experience</p>
        <h1>Eight years, two employers, measured contribution.</h1>
        <p class="lead">{{ experience.intro }}</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <TimelineList :entries="experience.entries" />
      </div>
    </section>
  </div>
</template>
