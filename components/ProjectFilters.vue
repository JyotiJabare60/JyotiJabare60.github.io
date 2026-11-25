<script setup lang="ts">
import type { ProjectCategory } from '~/types/content'

const props = defineProps<{
  categories: { id: ProjectCategory | 'all'; label: string; count: number }[]
  modelValue: ProjectCategory | 'all'
  shown: number
}>()
const emit = defineEmits<{ 'update:modelValue': [ProjectCategory | 'all'] }>()
</script>

<template>
  <div>
    <div class="filters" role="group" aria-label="Filter projects by category">
      <button
        v-for="c in props.categories"
        :key="c.id"
        type="button"
        class="filter"
        :aria-pressed="props.modelValue === c.id"
        @click="emit('update:modelValue', c.id)"
      >
        {{ c.label }} <span class="filter-count">{{ c.count }}</span>
      </button>
    </div>
    <p class="sr-only" role="status">{{ props.shown }} project{{ props.shown === 1 ? '' : 's' }} shown</p>
  </div>
</template>
