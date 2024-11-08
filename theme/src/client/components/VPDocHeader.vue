<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../composables/index.js'

defineProps<{
  title?: string
  anchor: string
}>()

const { theme, frontmatter } = useData()

const header = computed(() => {
  const outline = frontmatter.value.outline ?? theme.value.outline
  const level = Array.isArray(outline) ? outline[0] : outline === 'deep' ? 2 : outline || 2
  return `h${level}`
})
</script>

<template>
  <component :is="header" :id="anchor" tabindex="-1" class="vp-doc-header">
    <a :href="`#${anchor}`" class="header-anchor">
      <span><slot>{{ title }}</slot></span>
    </a>
  </component>
</template>

<style scoped>
.vp-doc h2.vp-doc-header {
  border-top: 1px solid var(--vp-c-divider);
}
</style>
