<script lang="ts" setup>
import { type Component, computed, nextTick, onUnmounted, resolveComponent, watch } from 'vue'
import { useData } from '../../composables/data.js'
import HomeBanner from './HomeBanner.vue'
import HomeHero from './HomeHero.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeTextImage from './HomeTextImage.vue'
import HomeProfile from './HomeProfile.vue'
import HomeCustom from './HomeCustom.vue'

const components: Record<string, Component<any, any, any>> = {
  'banner': HomeBanner,
  'hero': HomeHero,
  'features': HomeFeatures,
  'text-image': HomeTextImage,
  'image-text': HomeTextImage,
  'profile': HomeProfile,
  'custom': HomeCustom,
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
    el ??= document.querySelector('#LayoutContent')
    el?.classList.toggle('footer-no-border', value)
  }
}), { immediate: true })

onUnmounted(() => {
  el?.classList.remove('footer-no-border')
})
</script>

<template>
  <div class="plume-home">
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
.plume-home {
  min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
}

.plume-home .layout {
  transition: background-color var(--t-color);
}

.plume-home .layout:nth-child(odd) {
  background-color: var(--vp-c-bg-alt);
}

.plume-home .layout:nth-child(even) {
  background-color: var(--vp-c-bg);
}
</style>
