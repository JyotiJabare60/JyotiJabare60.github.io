<script setup lang="ts">
const site = useSite()
const certs = useCertifications()
usePageSeo({
  title: 'Certifications — Jyoti Jabare',
  description: 'Udemy certifications with public verification, plus a measured delivery record.',
  path: '/certifications',
  image: site.assets.ogImage,
})
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">Certifications &amp; achievements</p>
        <h1>Verifiable, not decorative.</h1>
        <p class="lead">{{ certs.intro }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cards-3">
          <CertCard v-for="c in certs.certifications" :key="c.title" :cert="c" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <SectionHead eyebrow="Delivery record" title="Achievements that need no claim beyond the code." />
        <StatRow :stats="certs.record" />
        <div class="cards-2" style="margin-top:var(--s7)">
          <div v-for="e in certs.evidence" :key="e.title" class="card">
            <div class="card-body">
              <h3>{{ e.title }}</h3>
              <p>{{ e.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
