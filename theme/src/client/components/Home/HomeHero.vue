<script setup lang="ts">
import { usePageFrontmatter, withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { computed } from 'vue'
import VButton from '../VButton.vue'
import { useDarkMode } from '../../composables/index.js'
import type { PlumeThemeHomeFrontmatter, PlumeThemeHomeHero } from '../../../shared/index.js'

const props = defineProps<PlumeThemeHomeHero>()

const matter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
const isDark = useDarkMode()

const heroBackground = computed(() => {
  if (props.background === 'filter-blur')
    return null
  const image = props.backgroundImage
    ? typeof props.backgroundImage === 'string'
      ? props.backgroundImage
      : (props.backgroundImage[isDark.value ? 'dark' : 'light'] ?? props.backgroundImage.light)
    : ''
  const background = image || props.background

  if (!background)
    return null

  const link = isLinkHttp(background) ? background : withBase(background)
  return {
    'background-image': `url(${link})`,
    'background-attachment': props.backgroundAttachment || '',
    '--vp-hero-bg-filter': props.filter,
  }
})

const hero = computed(() => props.hero ?? matter.value.hero ?? {})
const actions = computed(() => hero.value.actions ?? [])
</script>

<template>
  <div class="home-hero" :class="{ full: props.full, once: props.onlyOnce }">
    <div v-if="heroBackground" class="home-hero-bg" :style="heroBackground" />

    <div v-if="background === 'filter-blur'" class="bg-filter">
      <div class="g g-1" />
      <div class="g g-2" />
      <div class="g g-3" />
    </div>

    <div class="container">
      <div class="content">
        <h1 v-if="hero.name" class="hero-name" v-html="hero.name" />
        <p v-if="hero.tagline" class="hero-tagline" v-html="hero.tagline" />
        <p v-if="hero.text" class="hero-text" v-html="hero.text" />

        <div v-if="actions.length" class="actions">
          <div class="action">
            <VButton
              v-for="action in actions" :key="action.link" tag="a" size="medium" :theme="action.theme"
              :text="action.text" :href="action.link"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  position: relative;
  width: 100%;
}

.home-hero.full {
  height: calc(100vh - var(--vp-nav-height));
}

.home-hero.full.once {
  height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
}

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

.container {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
}

.home-hero.full .container {
  align-items: center;
  justify-content: center;
}

.home-hero:not(.full) .container {
  padding-top: 80px;
  padding-bottom: 80px;
}

.content {
  max-width: 960px;
  padding: 0 20px;
  margin: 0 auto;
  text-align: center;
}

.home-hero.full .container .content {
  margin-top: -40px;
}

.hero-name,
.hero-tagline {
  font-size: 48px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.5px;
}

.hero-name {
  background: linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 65%, var(--vp-c-brand-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}

.hero-text {
  margin: 18px 0 30px;
  font-size: 18px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  white-space: pre-wrap;
  transition: color var(--t-color);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 30px 0 0;
}

.action :deep(.VPButton) {
  margin-right: 24px;
}

.action :deep(.VPButton:last-of-type) {
  margin-right: 0;
}

/* =========== background filter begin ======= */
.bg-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

.home-hero.full.once .bg-filter {
  height: calc(100% + var(--vp-footer-height, 0px));
}

.bg-filter::before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  content: "";
  backdrop-filter: blur(150px);
  transform: translate3d(0, 0, 0);
}

.g {
  position: absolute;
  opacity: 0.5;
  transform: translate3d(0, 0, 0);
}

.g-1 {
  bottom: 100px;
  left: 50%;
  width: 714px;
  height: 390px;
  clip-path: polygon(0 10%, 30% 0, 100% 40%, 70% 100%, 20% 90%);
  background: var(--vp-c-yellow-3);
  transform: translate(-50%, 0);
}

.g-2 {
  bottom: 0;
  left: 30%;
  width: 1000px;
  height: 450px;
  clip-path: polygon(10% 0, 100% 70%, 100% 100%, 20% 90%);
  background: var(--vp-c-red-3);
  transform: translate(-50%, 0);
}

.g-3 {
  bottom: 0;
  left: 70%;
  width: 1000px;
  height: 450px;
  clip-path: polygon(80% 0, 100% 70%, 100% 100%, 20% 90%);
  background: var(--vp-c-purple-3);
  transform: translate(-50%, 0);
}

/* =========== background filter end ======= */

@media (min-width: 768px) {
  .hero-name,
  .hero-tagline {
    font-size: 64px;
  }

  .hero-text {
    font-size: 20px;
  }
}

@media (min-width: 960px) {
  .hero-name,
  .hero-tagline {
    font-size: 72px;
  }

  .hero-text {
    font-size: 24px;
  }
}
</style>
