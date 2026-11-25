<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import type { ThemeMode } from '~/composables/useTheme'

const { mode, setMode } = useTheme()
const options: { id: ThemeMode; label: string; icon: unknown }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]
</script>

<template>
  <div class="theme-switch" role="group" aria-label="Colour theme">
    <button
      v-for="o in options"
      :key="o.id"
      type="button"
      :title="o.label"
      :aria-pressed="mode === o.id"
      @click="setMode(o.id)"
    >
      <component :is="o.icon" :size="15" aria-hidden="true" />
      <span class="sr-only">{{ o.label }}</span>
    </button>
  </div>
</template>
