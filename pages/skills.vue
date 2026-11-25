<script setup lang="ts">
const site = useSite()
const skills = useSkills()
usePageSeo({
  title: 'Skills — Jyoti Jabare',
  description: 'Frontend, mobile, backend, database, AI, integrations and DevOps — each with the evidence behind it.',
  path: '/skills',
  image: site.assets.ogImage,
})
</script>

<template>
  <div>
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">Skills</p>
        <h1>What I use, and what proves it.</h1>
        <p class="lead">{{ skills.intro }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="expertise">
          <SkillGroupCard v-for="g in skills.groups" :key="g.title" :group="g" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <SectionHead eyebrow="Honest gaps" title="Named before an interviewer asks." />
        <div class="cards-3">
          <div v-for="g in skills.gaps" :key="g.title" class="card">
            <div class="card-body">
              <h3>{{ g.title }}</h3>
              <p>{{ g.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
