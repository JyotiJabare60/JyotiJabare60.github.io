<script setup lang="ts">
const site = useSite()
const profile = useProfile()
usePageSeo({
  title: 'About — Jyoti Jabare',
  description: 'Senior full-stack engineer: eight Angular applications and Vue 3 / Nuxt 3 on the web, six Flutter apps on mobile, Node.js and MongoDB behind both.',
  path: '/about',
  image: site.assets.ogImage,
})
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">About</p>
        <h1>I build in two depths, and they share a backend.</h1>
        <p class="lead">
          Senior full-stack engineer with 8+ years of experience building and releasing web and mobile
          applications. My pattern is depth on one product at a time across every layer of it, rather than a
          narrow slice of many.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container cs-layout">
        <div class="cs-body">
          <template v-for="block in profile.about" :key="block.heading">
            <h2>{{ block.heading }}</h2>
            <p v-for="(para, i) in block.body" :key="i">{{ para }}</p>
          </template>

          <h2>How I work</h2>
          <ul>
            <li v-for="h in profile.howIWork" :key="h.title"><b>{{ h.title }}.</b> {{ h.body }}</li>
          </ul>
        </div>

        <aside class="cs-aside">
          <h3>At a glance</h3>
          <dl>
            <div v-for="g in profile.glance" :key="g.term" class="spec-row">
              <dt>{{ g.term }}</dt><dd>{{ g.detail }}</dd>
            </div>
          </dl>
          <h3 style="margin-top:var(--s5)">Open to</h3>
          <p class="mono faint">Senior full-stack · Senior Flutter · Technical lead · AI-enabled applications</p>
        </aside>
      </div>
    </section>
  </div>
</template>
