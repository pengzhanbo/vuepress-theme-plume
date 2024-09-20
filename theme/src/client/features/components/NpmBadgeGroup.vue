<script setup lang="ts">
import type { NpmBadgeGroupOptions, NpmBadgeType } from '../composables/npm-badge.js'
import { computed, toRef } from 'vue'
import { useNpmBadgeGroup } from '../composables/npm-badge.js'
import NpmBadge from './NpmBadge.vue'

const props = defineProps<NpmBadgeGroupOptions>()

useNpmBadgeGroup(toRef(() => props))

const list = computed(() => {
  if (!props.items)
    return []

  if (Array.isArray(props.items))
    return props.items

  return props.items.split(',').map(type => type.trim()) as NpmBadgeType[]
})
</script>

<template>
  <p class="vp-npm-badge-group">
    <slot>
      <NpmBadge v-for="(type, index) in list" :key="type + index" :type="type" />
    </slot>
  </p>
</template>

<style scoped>
.vp-npm-badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
