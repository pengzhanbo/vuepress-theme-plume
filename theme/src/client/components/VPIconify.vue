<script lang="ts" setup>
import type { IconifyIcon } from '@iconify/vue/offline'
import { loadIcon } from '@iconify/vue'
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    name?: string
    size?: string | number
    color?: string
  }>(),
  {
    name: '',
    size: '',
    color: '',
  },
)

const icon = ref<IconifyIcon | null>(null)
const loaded = ref(false)

async function loadIconComponent() {
  if (icon.value)
    return

  if (!__VUEPRESS_SSR__) {
    try {
      loaded.value = false
      icon.value = await loadIcon(props.name)
    }
    finally {
      loaded.value = true
    }
  }
  else {
    loaded.value = true
  }
}

watch(() => props.name, loadIconComponent, { immediate: true })

const size = computed(() => {
  const size = props.size || '1em'
  if (String(Number(size)) === size)
    return `${size}px`

  return size
})
const color = computed(() => props.color || 'currentColor')

const bind = computed<any>(() => ({
  icon: icon.value,
  color: props.color,
  height: size.value,
}))
</script>

<template>
  <ClientOnly>
    <span v-if="!loaded" class="vp-icon iconify" :style="{ color, width: size, height: size }" />
    <OfflineIcon
      v-else-if="icon"
      class="vp-icon iconify"
      v-bind="bind"
    />
  </ClientOnly>
</template>
