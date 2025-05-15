<script setup lang="ts">
import VPIconFa from '@theme/VPIconFa.vue'
import VPIconfont from '@theme/VPIconfont.vue'
import VPIconify from '@theme/VPIconify.vue'
import VPIconImage from '@theme/VPIconImage.vue'
import { computed } from 'vue'
import { isLinkHttp } from 'vuepress/shared'

const props = defineProps<{
  provider?: 'iconify' | 'iconfont' | 'fontawesome'
  name: string | { svg: string }
  size?: string | number
  color?: string
  extra?: string
}>()

declare const __MD_POWER_ICON_PROVIDER__: 'iconify' | 'iconfont' | 'fontawesome'
declare const __MD_POWER_ICON_PREFIX__: string

const type = computed(() => {
  const provider = props.provider || __MD_POWER_ICON_PROVIDER__
  // name -> https://example.com/icon.svg
  // name -> /icon.svg
  if (typeof props.name === 'string' && (isLinkHttp(props.name) || props.name[0] === '/')) {
    return 'link'
  }

  // name -> { svg: '<svg></svg>' }
  if (typeof props.name === 'object' && !!props.name.svg) {
    return 'svg'
  }

  if (provider === 'iconfont' || provider === 'fontawesome') {
    return provider
  }

  return 'iconify'
})

function parseSize(size: string | number): string {
  if (String(Number(size)) === String(size))
    return `${size}px`
  return String(size)
}

const size = computed(() => {
  const size = props.size
  if (!size)
    return undefined

  const [width, height] = String(size)
    .replaceAll('px', '[UNIT]')
    .split('x')
    .map(s => parseSize(s.replaceAll('[UNIT]', 'px').trim()))

  return { width, height: height || width }
})
const binding = computed(() => ({
  name: props.name as string,
  color: props.color,
  size: size.value,
  prefix: __MD_POWER_ICON_PREFIX__ as any,
}))
</script>

<template>
  <VPIconImage
    v-if="type === 'link' || type === 'svg'"
    :type="type" :name="name" :color="color" :size="size"
  />
  <VPIconfont
    v-else-if="type === 'iconfont'"
    v-bind="binding"
  />
  <VPIconFa
    v-else-if="type === 'fontawesome'"
    :extra="extra"
    v-bind="{ ...binding, ...$attrs }"
  />
  <VPIconify
    v-else-if="type === 'iconify'"
    :extra="extra"
    v-bind="binding"
  />
</template>
