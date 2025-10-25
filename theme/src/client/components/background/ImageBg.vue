<script setup lang="ts">
import type { ThemeHomeHero } from '../../../shared/index.js'
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useData } from '../../composables/index.js'
import { isGradient } from '../../utils/index.js'

const props = defineProps<ThemeHomeHero>()

const { isDark } = useData()

const heroBackground = computed(() => {
  const image = props.backgroundImage
    ? typeof props.backgroundImage === 'string'
      ? props.backgroundImage
      // 如果 dark 没有，取 light
      : (props.backgroundImage[isDark.value ? 'dark' : 'light'] ?? props.backgroundImage.light)
    : ''
  const background = (image || props.background)?.trim()

  if (!background)
    return null

  const gradient = isGradient(background)

  const link = isLinkHttp(background) || gradient ? background : withBase(background)
  return {
    'background-image': gradient ? background : `url(${link})`,
    'background-attachment': props.backgroundAttachment,
    '--vp-hero-bg-filter': props.filter,
  }
})
</script>

<template>
  <div v-if="heroBackground" class="home-hero-bg" :style="heroBackground" />
</template>

<style scoped>
.home-hero-bg {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  filter: var(--vp-hero-bg-filter);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: translate3d(0, 0, 0);
}
</style>
