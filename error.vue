<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <div>
    <AppHeader />
    <main id="main">
      <section class="page-head">
        <div class="container">
          <p class="eyebrow">{{ error.statusCode }}</p>
          <h1>{{ error.statusCode === 404 ? 'That page does not exist.' : 'Something went wrong.' }}</h1>
          <p class="lead">{{ error.statusMessage }}</p>
          <p class="hero-actions">
            <NuxtLink class="btn btn-primary" to="/">Back to home</NuxtLink>
            <NuxtLink class="btn btn-secondary" to="/projects">View projects</NuxtLink>
          </p>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
