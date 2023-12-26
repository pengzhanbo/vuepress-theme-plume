<script lang="ts" setup>
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { ClientOnly } from '@vuepress/client'
import type { CSSProperties } from 'vue'
import { computed, toRefs } from 'vue'
import { useIconify } from '../composables/iconify.js'

const props = withDefaults(
  defineProps<{
    name?: string
    size?: string
    color?: string
  }>(),
  {
    name: '',
    size: '',
    color: '',
  },
)

const { name } = toRefs(props)

const { icon, loaded } = useIconify(name)

const size = computed(() => {
  const size = props.size || __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_SIZE__
  if (String(Number(size)) === size)
    return `${size}px`

  return size
})
const iconStyle = computed(() => {
  const style: CSSProperties = {
    color: props.color || __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__,
    width: size.value,
    height: size.value,
  }
  return style
})
</script>

<script lang="ts">
declare const __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_SIZE__: string
declare const __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__: string
</script>

<template>
  <ClientOnly>
    <span v-if="!loaded" class="vp-iconify" :style="iconStyle" />
    <OfflineIcon
      v-else-if="icon"
      :icon="icon"
      class="vp-iconify"
      :style="iconStyle"
    />
    <span v-else class="vp-iconify" :style="{ ...iconStyle, fontSize: size }">
      {{ props.name }}
    </span>
  </ClientOnly>
</template>

<style scoped>
.vp-iconify {
  display: inline-block;
  vertical-align: middle;
}
</style>
