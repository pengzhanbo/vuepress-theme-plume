<script setup lang="ts">
import VPIconify from '@theme/VPIconify.vue'
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useIconsData } from '../composables/index.js'

const props = defineProps<{
  name: string | { svg: string }
  size?: string | number
  color?: string
}>()

const iconsData = useIconsData()

const type = computed(() => {
  if (typeof props.name === 'string' && (isLinkHttp(props.name) || props.name[0] === '/')) {
    return 'link'
  }
  if (typeof props.name === 'object' && !!props.name.svg) {
    return 'svg'
  }
  if (typeof props.name === 'string' && iconsData.value[props.name]) {
    return 'local'
  }
  return 'remote'
})

const svg = computed(() => {
  if (type.value === 'svg')
    return (props.name as { svg: string }).svg

  return ''
})
const link = computed(() => {
  if (type.value === 'link') {
    const link = props.name as string
    return isLinkHttp(link) ? link : withBase(link)
  }
  return ''
})

const className = computed(() => {
  if (type.value === 'local') {
    const name = props.name as string
    return iconsData.value[name] || ''
  }
  return ''
})

const size = computed(() => {
  const size = props.size
  if (!size)
    return undefined
  if (String(Number(size)) === size)
    return `${size}px`

  return size
})

const style = computed(() => ({
  'background-color': props.color,
  'width': size.value,
  'height': size.value,
}))
</script>

<template>
  <span v-if="type === 'link'" class="vp-icon-img">
    <img :src="link" alt="" :style="{ height: size }">
  </span>
  <span
    v-else-if="type === 'svg'"
    class="vp-icon"
    :style="style"
    v-html="svg"
  />
  <span
    v-else-if="type === 'local' && className"
    class="vp-icon" :class="[className]"
    :style="style"
  />
  <VPIconify v-else :name="(name as string)" :size="size" :color="color" />
</template>

<style scoped>
.vp-icon-img {
  display: inline-block;
  width: max-content;
  height: 1em;
  margin: 0 0.3em;
  vertical-align: middle;
}

.vp-icon-img img {
  height: 100%;
}
</style>
