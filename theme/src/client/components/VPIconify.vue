<script lang="ts" setup>
import type { IconifyIcon } from '@iconify/vue/offline'
import { loadIcon } from '@iconify/vue'
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { computed, ref, watch } from 'vue'
import { normalizeIconClassname } from '../composables/index.js'

defineOptions({
  inheritAttrs: false,
})

const { name, size, color, prefix, extra } = defineProps<{
  name: string
  size?: { width?: string, height?: string }
  color?: string
  prefix?: string
  extra?: string
}>()

const icon = ref<IconifyIcon | null>(null)
const loaded = ref(false)

const iconName = computed(() => {
  if (name.includes(':'))
    return name
  return prefix ? `${prefix}:${name}` : name
})

const classname = computed(() => normalizeIconClassname(iconName.value))

async function loadRemoteIcon() {
  if (classname.value || icon.value)
    return

  loaded.value = false
  icon.value = await loadIcon(name)
  loaded.value = true
}

if (!__VUEPRESS_SSR__)
  watch(() => name, loadRemoteIcon, { immediate: true })
</script>

<template>
  <span
    v-if="classname"
    class="vp-icon" :class="[classname, extra]"
    :style="{ color, ...size }"
    aria-hidden
    data-provider="iconify"
    v-bind="$attrs"
  />
  <ClientOnly v-else>
    <span v-if="!loaded" class="vp-icon iconify" :style="{ color, ...size }" v-bind="$attrs" />
    <OfflineIcon
      v-else-if="icon"
      class="vp-icon iconify"
      :class="[extra]"
      :icon="icon"
      :style="{ color, ...size }"
      aria-hidden
      data-provider="iconify"
    />
  </ClientOnly>
</template>
