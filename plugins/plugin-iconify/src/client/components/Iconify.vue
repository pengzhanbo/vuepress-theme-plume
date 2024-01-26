<script lang="ts" setup>
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { ClientOnly } from 'vuepress/client'
import type { IconifyRenderMode } from '@iconify/vue'
import type { StyleValue } from 'vue'
import { computed, toRefs } from 'vue'
import { useIconify } from '../composables/iconify.js'

const props = withDefaults(
  defineProps<{
    name?: string
    size?: string | number
    color?: string
    mode?: IconifyRenderMode
    style?: StyleValue
    flip?: string
    vFlip?: boolean
    hFlip?: boolean
    inline?: boolean
    rotate?: number
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
const color = computed(() => props.color || __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__)

const bind = computed<any>(() => ({
  icon: icon.value,
  mode: props.mode,
  inline: props.inline,
  rotate: props.rotate,
  flip: props.flip,
  vFlip: props.vFlip,
  hFlip: props.hFlip,
  color: props.color,
  width: size.value,
  height: size.value,
  style: props.style,
}))
</script>

<script lang="ts">
declare const __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_SIZE__: string
declare const __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__: string
</script>

<template>
  <ClientOnly>
    <span v-if="!loaded" class="vp-iconify" :style="{ color, width: size, height: size }" />
    <OfflineIcon
      v-else-if="icon"
      class="vp-iconify"
      v-bind="bind"
    />
  </ClientOnly>
</template>

<style scoped>
.vp-iconify {
  display: inline-block;
  vertical-align: middle;
}
</style>
