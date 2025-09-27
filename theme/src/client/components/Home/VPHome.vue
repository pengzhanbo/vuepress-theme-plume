<script lang="ts" setup>
import type { Component } from 'vue'
import VPHomeBanner from '@theme/Home/VPHomeBanner.vue'
import VPHomeCustom from '@theme/Home/VPHomeCustom.vue'
import VPHomeDocHero from '@theme/Home/VPHomeDocHero.vue'
import VPHomeFeatures from '@theme/Home/VPHomeFeatures.vue'
import VPHomeHero from '@theme/Home/VPHomeHero.vue'
import VPHomeProfile from '@theme/Home/VPHomeProfile.vue'
import VPHomeTextImage from '@theme/Home/VPHomeTextImage.vue'
import VPPosts from '@theme/Posts/VPPosts.vue'
import { computed, h, nextTick, onUnmounted, resolveComponent, watch } from 'vue'
import { useData } from '../../composables/index.js'

const slots = defineSlots<{
  'posts-top': () => any
  'posts-bottom': () => any
  'posts-post-list-before': () => any
  'posts-post-list-after': () => any
  'posts-post-list-pagination-after': () => any
}>()

function VPHomePosts() {
  return h(VPPosts, { homePosts: true }, {
    'posts-top': () => slots['posts-top']?.(),
    'posts-bottom': () => slots['posts-bottom']?.(),
    'posts-post-list-before': () => slots['posts-post-list-before']?.(),
    'posts-post-list-after': () => slots['posts-post-list-after']?.(),
    'posts-post-list-pagination-after': () => slots['posts-post-list-pagination-after']?.(),
  })
}

const components: Record<string, Component<any, any, any>> = {
  'banner': VPHomeBanner,
  'hero': VPHomeHero,
  'doc-hero': VPHomeDocHero,
  'features': VPHomeFeatures,
  'text-image': VPHomeTextImage,
  'image-text': VPHomeTextImage,
  'profile': VPHomeProfile,
  'blog': VPHomePosts,
  'posts': VPHomePosts,
  'custom': VPHomeCustom,
}

const DEFAULT_HERO = {
  name: 'Theme Plume',
  tagline: 'VuePress Next Theme',
  text: '一个简约的，功能丰富的 vuepress 文档&博客 主题',
}

const { frontmatter: matter } = useData<'home'>()

const config = computed(() => {
  const config = matter.value.config
  if (config && config.length)
    return config

  // @deprecated
  // 适配旧版本配置，将在正式版本中删去
  if (matter.value.banner) {
    return [{
      type: 'banner',
      banner: matter.value.banner,
      bannerMask: matter.value.bannerMask,
      hero: matter.value.hero ?? DEFAULT_HERO,
    }]
  }

  return [{
    type: 'hero',
    full: true,
    background: 'tint-plate',
    hero: matter.value.hero ?? DEFAULT_HERO,
  }]
})

const onlyOnce = computed(() => config.value.length === 1)

function resolveComponentName(type: string) {
  return components[type] ?? resolveComponent(type)
}

let el: HTMLDivElement | null = null

watch(() => onlyOnce.value, value => nextTick(() => {
  if (typeof document !== 'undefined') {
    el ??= document.querySelector('.vp-layout')
    el?.classList.toggle('footer-no-border', value)
  }
}), { immediate: true })

onUnmounted(() => {
  el?.classList.remove('footer-no-border')
})
</script>

<template>
  <div class="vp-home">
    <template
      v-for="(item, index) in config"
      :key="item.type + index"
    >
      <div :class="{ layout: index > 0 && item.type !== 'features' && item.type !== 'custom' }">
        <component
          :is="resolveComponentName(item.type)"
          v-bind="item"
          :only-once="onlyOnce"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.vp-home {
  min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
}

.vp-home .layout {
  transition: background-color var(--vp-t-color);
}

.vp-home .layout:nth-child(odd) {
  background-color: var(--vp-c-bg-alt);
}

.vp-home .layout:nth-child(even) {
  background-color: var(--vp-c-bg);
}
</style>
