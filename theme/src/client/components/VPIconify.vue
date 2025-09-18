<script lang="ts" setup>
import type { IconifyIcon } from '@iconify/vue/offline'
import { loadIcon } from '@iconify/vue'
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { computed, ref, watch } from 'vue'
import { useIconsData } from '../composables/index.js'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  name: string
  size?: { width?: string, height?: string }
  color?: string
  prefix?: string
  extra?: string
}>()

const icon = ref<IconifyIcon | null>(null)
const loaded = ref(false)

const iconsData = useIconsData()

const iconName = computed(() => {
  const name = props.name
  if (name.includes(':'))
    return name
  return props.prefix ? `${props.prefix}:${name}` : name
})

const localIconName = computed(() => iconsData.value[iconName.value])

async function loadRemoteIcon() {
  if (icon.value)
    return

  if (!localIconName.value) {
    loaded.value = false
    icon.value = await loadIcon(props.name)
  }
  loaded.value = true
}

if (!__VUEPRESS_SSR__)
  watch(() => props.name, loadRemoteIcon, { immediate: true })
</script>

<template>
  <span
    v-if="localIconName"
    class="vp-icon" :class="[localIconName, extra]"
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
