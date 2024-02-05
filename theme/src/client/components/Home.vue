<script lang="ts" setup>
import { usePageFrontmatter, withBase } from 'vuepress/client'
import { computed } from 'vue'
import type { PlumeThemeHomeFrontmatter } from '../../shared/index.js'
import { useDarkMode } from '../composables/darkMode.js'
import VButton from './VButton.vue'

const matter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
const isDark = useDarkMode()

const mask = computed(() => {
  if (typeof matter.value.bannerMask !== 'object')
    return matter.value.bannerMask || 0

  return (
    (isDark.value
      ? matter.value.bannerMask.dark
      : matter.value.bannerMask.light) || 0
  )
})

const homeStyle = computed(() => {
  return {
    'background-image': [
      mask.value
        ? `linear-gradient(rgba(0, 0, 0, ${mask.value}), rgba(0, 0, 0, ${mask.value}))`
        : '',
      `url(${withBase(matter.value.banner ?? 'http://file.mo7.cc/api/public/bz')})`,
    ]
      .filter(Boolean)
      .join(','),
  }
})

const name = computed(() => matter.value.hero?.name ?? 'Plume')
const tagline = computed(() => matter.value.hero?.tagline ?? 'A VuePress Theme')
const text = computed(() => matter.value.hero?.text)

const actions = computed(() => {
  return matter.value.hero?.actions ?? []
})
</script>

<template>
  <div class="plume-home" :style="homeStyle">
    <div class="container">
      <div class="content">
        <h2 v-if="name" class="hero-name">
          {{ name }}
        </h2>
        <p v-if="tagline" class="hero-tagline">
          <span class="line" /> <span>{{ tagline }}</span>
        </p>
        <p v-if="text" class="hero-text">
          {{ text }}
        </p>
        <div v-if="actions" class="actions">
          <div v-for="action in actions" :key="action.link" class="action">
            <VButton
              tag="a"
              size="medium"
              :theme="action.theme"
              :text="action.text"
              :href="action.link"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plume-home {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  filter: var(--vp-home-hero-image-filter);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: all var(--t-color);
}

.plume-home .container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-top: 4rem;
  margin: 0 auto;
}

.plume-home .content {
  width: 100%;
  padding: 0 2rem;
}

.plume-home .content .hero-name {
  font-size: 72px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-hero-name);
}

.plume-home .content .hero-tagline {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--vp-c-text-hero-tagline);
}

.plume-home .content .hero-tagline .line {
  display: inline-block;
  width: 80px;
  height: 0;
  margin-right: 1rem;
  border-top: solid 1px var(--vp-c-text-hero-tagline);
}

.plume-home .content .hero-text {
  width: 100%;
  max-width: 700px;
  margin-top: 1.5rem;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-hero-text);

  /* padding: 6px 20px; */
  border-radius: 5px;

  /* background-color: rgba(0, 0, 0, 0.25); */
}

@media (min-width: 960px) {
  .plume-home .container {
    max-width: 768px;
    padding-top: 8rem;
  }

  .plume-home .content .hero-name {
    font-size: 100px;
  }
}

@media (min-width: 1440px) {
  .plume-home .container {
    max-width: 1104px;
    padding-top: 8rem;
  }

  .plume-home .content .hero-tagline {
    font-size: 32px;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  padding-top: 24px;
  margin: -6px;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}
</style>
