<script lang="ts" setup>
import { usePageFrontmatter, withBase } from '@vuepress/client'
import { isLinkHttp } from '@vuepress/shared'
import { computed, onMounted, ref } from 'vue'
import type { PlumeThemeHomeFrontmatter } from '../../shared'

const frontmatter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
const MOBILE_WIDTH = 716

const bannerImg = ref(frontmatter.value.banner || '')
const hasBanner = computed(
  () => !!(frontmatter.value.banner || frontmatter.value.mobileBanner)
)
const bannerStyle = computed(() => {
  if (!hasBanner.value) return ''
  const url = isLinkHttp(bannerImg.value)
    ? bannerImg.value
    : withBase(bannerImg.value)
  return {
    'background-image': `url(${url})`,
  }
})

function handleResize(): void {
  const width = document.documentElement.offsetWidth
  if (!hasBanner.value) return
  if (width < MOBILE_WIDTH) {
    bannerImg.value =
      frontmatter.value.mobileBanner || frontmatter.value.banner || ''
  } else {
    bannerImg.value = frontmatter.value.banner || ''
  }
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, false)
  window.addEventListener('orientationchange', handleResize, false)
})
</script>
<template>
  <div
    v-if="hasBanner"
    class="home-big-banner-wrapper"
    :style="bannerStyle"
  ></div>
</template>
<style lang="scss">
.home-big-banner-wrapper {
  width: 100%;
  height: calc(100vh - var(--navbar-height));
  background-color: transparent;
  background-position: 0 0;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
