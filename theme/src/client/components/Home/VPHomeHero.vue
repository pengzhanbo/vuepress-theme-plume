<script setup lang="ts">
import type { PlumeThemeHomeHero } from '../../../shared/index.js'
import VPButton from '@theme/VPButton.vue'
import { computed, ref } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useData, useHomeHeroTintPlate } from '../../composables/index.js'

const props = defineProps<PlumeThemeHomeHero>()

const { isDark, frontmatter: matter } = useData<'home'>()

const heroBackground = computed(() => {
  if (props.background === 'tint-plate')
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

const canvas = ref<HTMLCanvasElement>()
useHomeHeroTintPlate(
  canvas,
  computed(() => props.background === 'tint-plate'),
  computed(() => props.tintPlate),
)
</script>

<template>
  <div class="vp-home-hero" :class="{ full: props.full, once: props.onlyOnce }">
    <div v-if="heroBackground" class="home-hero-bg" :style="heroBackground" />

    <div v-if="background === 'tint-plate'" class="bg-filter">
      <canvas ref="canvas" width="32" height="32" />
    </div>

    <div class="container">
      <div class="content">
        <h1 v-if="hero.name" class="hero-name" v-html="hero.name" />
        <p v-if="hero.tagline" class="hero-tagline" v-html="hero.tagline" />
        <p v-if="hero.text" class="hero-text" v-html="hero.text" />

        <div v-if="actions.length" class="actions">
          <div class="action">
            <VPButton
              v-for="action in actions"
              :key="action.link"
              tag="a"
              size="medium"
              :theme="action.theme"
              :text="action.text"
              :href="action.link"
              :target="action.target"
              :rel="action.rel"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-home-hero {
  position: relative;
  width: 100%;
}

.vp-home-hero.full {
  height: calc(100vh - var(--vp-nav-height));
}

.vp-home-hero.full.once {
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

.vp-home-hero.full .container {
  align-items: center;
  justify-content: center;
}

.vp-home-hero:not(.full) .container {
  padding-top: 80px;
  padding-bottom: 80px;
}

.content {
  max-width: 960px;
  padding: 0 20px;
  margin: 0 auto;
  text-align: center;
}

.vp-home-hero.full .container .content {
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
  background: var(--vp-bg-home-hero-name, linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 65%, var(--vp-c-brand-2) 100%));
  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  color: var(--vp-c-home-hero-tagline, var(--vp-c-text-2));
  transition: color var(--vp-t-color);
}

.hero-text {
  margin: 18px 0 30px;
  font-size: 18px;
  font-weight: 500;
  color: var(--vp-c-home-hero-text, var(--vp-c-text-3));
  white-space: pre-wrap;
  transition: color var(--vp-t-color);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 30px 0 0;
}

.action :deep(.vp-button) {
  margin-right: 24px;
}

.action :deep(.vp-button:last-of-type) {
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

.vp-home-hero.full.once .bg-filter {
  height: calc(100% + var(--vp-footer-height, 0px));
}

@property --vp-home-hero-bg-filter {
  inherits: false;
  initial-value: #fff;
  syntax: "<color>";
}

.bg-filter::after {
  --vp-home-hero-bg-filter: var(--vp-c-bg);

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background: linear-gradient(to bottom, var(--vp-home-hero-bg-filter) 0, transparent 45%, transparent 55%, var(--vp-home-hero-bg-filter) 140%);
  transition: --vp-home-hero-bg-filter var(--vp-t-color);
}

.bg-filter canvas {
  width: 100%;
  height: 100%;
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
