<script setup lang="ts">
import type { FontAwesomePrefix } from 'vuepress-plugin-md-power/client'
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: { width?: string, height?: string }
  color?: string
  prefix?: FontAwesomePrefix
  extra?: string
}>()

const configs: Record<string, FontAwesomePrefix[]> = {
  'solid': ['fas', 's'],
  'regular': ['far', 'r'],
  'light': ['fal', 'l'],
  'thin': ['fat', 't'],
  'duotone solid': ['fads', 'ds'],
  'sharp solid': ['fass', 'ss'],
  'sharp regular': ['fasr', 'sr'],
  'sharp light': ['fasl', 'sl'],
  'sharp thin': ['fast', 'st'],
  'sharp-duotone solid': ['fasds', 'sds'],
  'brands': ['fab', 'b'],
}

const iconName = computed(() => {
  const icon = props.name.includes(':') ? props.name : `${props.prefix || 'fas'}:${props.name}`
  const [type, name] = icon.split(':')
  let prefix = 'solid'
  for (const [key, alias] of Object.entries(configs)) {
    if (alias.includes(type as FontAwesomePrefix)) {
      prefix = key
      break
    }
  }
  return `${prefix.split(' ').map(v => `fa-${v.trim()}`).join(' ')} fa-${name}`
})

const extraClasses = computed(() => {
  const extra = props.extra
  if (!extra)
    return []
  return extra.split(' ').map(v => v.trim().startsWith('fa-') ? v : `fa-${v}`)
})
</script>

<template>
  <i
    class="vp-icon fontawesome" :class="[iconName, ...extraClasses]"
    data-provider="fontawesome" aria-hidden
    :style="{ color, ...size }"
  />
</template>

<style>
.vp-icon.fontawesome {
  display: inline-block;
  line-height: inherit;
  vertical-align: middle;
}
</style>
