<script setup lang="ts">
import VPIconFa from '@theme/VPIconFa.vue'
import VPIconfont from '@theme/VPIconfont.vue'
import VPIconify from '@theme/VPIconify.vue'
import VPIconImage from '@theme/VPIconImage.vue'
import { computed } from 'vue'
import { isLinkHttp } from 'vuepress/shared'

const { provider, name, size, color, extra } = defineProps<{
  provider?: 'iconify' | 'iconfont' | 'fontawesome'
  name: string | { svg: string }
  size?: string | number
  color?: string
  extra?: string
}>()

declare const __MD_POWER_ICON_PROVIDER__: 'iconify' | 'iconfont' | 'fontawesome'
declare const __MD_POWER_ICON_PREFIX__: string

const type = computed(() => {
  // name -> https://example.com/icon.svg
  // name -> /icon.svg
  if (typeof name === 'string' && (isLinkHttp(name) || name[0] === '/')) {
    return 'link'
  }

  // name -> { svg: '<svg></svg>' }
  if (typeof name === 'object' && !!name.svg) {
    return 'svg'
  }

  if (typeof name === 'string') {
    if (name.startsWith('iconify'))
      return 'iconify'

    if (name.startsWith('iconfont'))
      return 'iconfont'

    if (name.startsWith('fontawesome'))
      return 'fontawesome'
  }

  const _provider = provider || __MD_POWER_ICON_PROVIDER__
  if (_provider === 'iconfont' || _provider === 'fontawesome') {
    return _provider
  }

  return 'iconify'
})

function parseSize(size: string | number): string {
  if (String(Number(size)) === String(size))
    return `${size}px`
  return String(size)
}

const rect = computed(() => {
  if (!size)
    return undefined

  const [width, height] = String(size)
    .replaceAll('px', '[UNIT]')
    .split('x')
    .map(s => parseSize(s.replaceAll('[UNIT]', 'px').trim()))

  return { width, height: height || width }
})
const binding = computed(() => ({
  name: typeof name === 'string'
    ? name.replace(/^(iconify|iconfont|fontawesome)\s+/, '')
    : name as unknown as string,
  color,
  size: rect.value,
  prefix: __MD_POWER_ICON_PREFIX__ as any,
}))
</script>

<template>
  <VPIconImage
    v-if="type === 'link' || type === 'svg'"
    :type="type"
    v-bind="binding"
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
