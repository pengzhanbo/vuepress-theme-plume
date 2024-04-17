<script setup lang="ts">
import { computed } from 'vue'
import { isLinkHttp } from 'vuepress/shared'
import { withBase } from 'vuepress/client'

const props = defineProps<{
  name: string | { svg: string }
}>()

const isLink = computed(() =>
  typeof props.name === 'string' && (isLinkHttp(props.name) || props.name[0] === '/'),
)
const isSvg = computed(() => typeof props.name === 'object' && !!props.name.svg)

const svg = computed(() => {
  if (isSvg.value)
    return (props.name as { svg: string }).svg

  return ''
})
const link = computed(() => {
  if (isLink.value) {
    const link = props.name as string
    return isLinkHttp(link) ? link : withBase(link)
  }
  return ''
})
</script>

<template>
  <img v-if="isLink" class="vp__img" :src="link" alt="">
  <span v-else-if="isSvg" class="vp-iconify" v-html="svg" />
  <Icon v-else :name="name" />
</template>

<style scoped>
.vp__img {
  display: inline-block;
  height: 1em;
  margin: 0.3em;
  vertical-align: middle;
}
</style>
