<script setup lang="ts">
const site = useSite()
usePageSeo({
  title: 'Contact — Jyoti Jabare',
  description: 'Available from December 2026 for senior full-stack, Flutter and technical lead roles.',
  path: '/contact',
  image: site.assets.ogImage,
})

const assetUrl = useAssetUrl()
const mailtoHref = computed(() => `mailto:${site.email}`)
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">Contact</p>
        <h1>{{ site.availability }}.</h1>
        <p class="lead">Open to senior full-stack, Flutter and technical lead roles — remote, or based in Navi Mumbai.</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <div>
          <h2 style="margin-bottom:var(--s5)">Get in touch</h2>
          <p>
            The fastest route is email — I reply to everything within two working days. No contact form is
            wired to a backend here, which keeps the site static, fast and free of data handling.
          </p>
          <p class="hero-actions">
            <a class="btn btn-primary" :href="mailtoHref">{{ site.email }}</a>
            <a class="btn btn-secondary" :href="site.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>

        <div>
          <h2 style="margin-bottom:var(--s5)">Direct</h2>
          <ul class="contact-list">
            <li><span class="k">Email</span><a :href="mailtoHref">{{ site.email }}</a></li>
            <li><span class="k">LinkedIn</span><a :href="site.linkedin" target="_blank" rel="noopener noreferrer">{{ site.linkedinLabel }}</a></li>
            <li v-if="site.assets.githubUrl"><span class="k">GitHub</span><a :href="site.assets.githubUrl" target="_blank" rel="noopener noreferrer">GitHub profile</a></li>
            <li><span class="k">Location</span><span>{{ site.location }}</span></li>
            <li><span class="k">Availability</span><span class="avail">{{ site.availability }}</span></li>
            <li v-if="site.assets.resumePdf"><span class="k">Résumé</span><a :href="assetUrl(site.assets.resumePdf)" download>Download PDF</a></li>
          </ul>
          <CalloutBox style="margin-top:var(--s7)">
            Looking for the detail behind a project? Every case study states my measured share of the
            repository and separates my work from the team's.
          </CalloutBox>
        </div>
      </div>
    </section>
  </div>
</template>
