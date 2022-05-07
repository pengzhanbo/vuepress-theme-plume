<script lang="ts" setup>
import { usePageFrontmatter, withBase } from '@vuepress/client'
import { isLinkHttp } from '@vuepress/shared'
import { computed, onMounted, ref } from 'vue'
import type { PlumeThemeHomeFrontmatter } from '../../shared'
import { useThemeLocaleData } from '../composables'
import { scrollTo } from '../utils'
import { ArrowBottomIcon } from './icons'

const frontmatter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
const MOBILE_WIDTH = 716

const bannerImg = ref(frontmatter.value.banner || '')
const hasBanner = computed(() => !!bannerImg.value)
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
  if (__VUEPRESS_SSR__) return
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
let screenHeight = 0
const arrowHandle = (): void => {
  if (!screenHeight) {
    screenHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    screenHeight -=
      document.querySelector<HTMLElement>('.navbar-wrapper')?.offsetHeight || 0
  }
  scrollTo(document, screenHeight)
}

const themeLocale = useThemeLocaleData()
const avatar = themeLocale.value.avatar || {}
</script>
<template>
  <div v-if="hasBanner" class="home-big-banner-wrapper" :style="bannerStyle">
    <ArrowBottomIcon @click="arrowHandle" />
    <div class="home-blogger-info">
      <div class="blogger-img">
        <img :src="avatar.url" :alt="avatar.name" />
      </div>
      <h3>{{ avatar.name }}</h3>
      <p v-if="frontmatter.motto" class="blogger-motto">
        {{ frontmatter.motto }}
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.home-big-banner-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: calc(100vh - var(--navbar-height));
  background-color: transparent;
  background-position: 0 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;

  .arrow-bottom-icon {
    position: absolute;
    bottom: 1.25rem;
    left: 50%;
    width: 48px;
    height: 48px;
    color: var(--c-home-arrow-bottom);
    animation: home-banner-arrow 1.5s ease 0.3s infinite;
    cursor: pointer;
  }

  .home-blogger-info {
    margin: auto;
    text-align: center;
    .blogger-img {
      width: 240px;
      height: 240px;
      border-radius: 50%;
      overflow: hidden;
      padding: 1.25rem;
      background-color: rgba(0, 0, 0, 0.25);
      margin: auto;

      img {
        width: 100%;
        border-radius: 50%;
      }
    }

    h3 {
      display: inline-block;
      font-size: 64px;
      max-width: var(--content-width);
      color: rgba(255, 255, 255, 0.85);
      padding: 0 1.25rem;
      margin: 1rem 0;
    }

    .blogger-motto {
      max-width: var(--content-width);
      font-size: 32px;
      color: rgba(255, 255, 255, 0.75);
      padding: 0 1.25rem;
      border-radius: var(--p-around);
    }
  }
}

@keyframes home-banner-arrow {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  10% {
    opacity: 0.45;
  }

  95% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0.25;
    transform: translateY(-7px);
  }
}
</style>
