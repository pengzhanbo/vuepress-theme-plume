<script setup lang="ts">
import type { ThemeHomeHero } from '../../../shared/index.js'
import { effectComponents, effects } from '@internal/home-hero-effects'
import ImageBg from '@theme/background/ImageBg.vue'
import VPButton from '@theme/VPButton.vue'
import { hasGlobalComponent } from '@vuepress/helper/client'
import { computed, markRaw, nextTick, onMounted, onUnmounted, resolveComponent, watch } from 'vue'
import { isPlainObject } from 'vuepress/shared'
import { useData } from '../../composables/index.js'
import { inBrowser } from '../../utils/index.js'

const props = defineProps<ThemeHomeHero>()

const { frontmatter, isDark } = useData<'home'>()
const hero = computed(() => props.hero ?? frontmatter.value.hero ?? {})
const actions = computed(() => hero.value.actions ?? [])

const effect = computed(() => {
  if (props.effect)
    return props.effect
  if (props.background && effects.includes(props.background))
    return props.background
  return null
})

const effectConfig = computed(() => {
  // compatibility
  if (effect.value === 'tint-plate') {
    const plate = props.tintPlate ?? props.effectConfig
    if (typeof plate === 'number' || typeof plate === 'string') {
      return { rgb: plate }
    }
    return plate
  }
  // guide compatible
  if (!isPlainObject(props.effectConfig))
    return null

  return props.effectConfig
})

const realEffectComponent = computed(() => {
  if (!effect.value)
    return null
  if (effectComponents[effect.value])
    return markRaw(effectComponents[effect.value])
  if (hasGlobalComponent(effect.value))
    return resolveComponent(effect.value)

  return null
})

function noTransition() {
  document.documentElement.classList.add('no-transition')
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition')
  }, 300)
}

let defaultTheme: string | undefined
watch(() => props.forceDark, () => {
  if (!inBrowser || __VUEPRESS_SSR__)
    return
  if (props.forceDark) {
    defaultTheme ??= document.documentElement.dataset.theme
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.classList.add('force-dark')
    nextTick(() => isDark.value = true)
    noTransition()
  }
  document.documentElement.classList.add(`effect-${effect.value}`)
}, { immediate: true })

onMounted(() => {
  if (props.forceDark) {
    window.addEventListener('unload', () => {
      isDark.value = defaultTheme === 'dark'
    })
  }
})

onUnmounted(() => {
  if (props.forceDark) {
    isDark.value = defaultTheme === 'dark'
    document.documentElement.classList.remove('force-dark', `effect-${effect.value}`)
    noTransition()
  }
})
</script>

<template>
  <div
    class="vp-home-hero"
    :class="{
      full,
      once: onlyOnce,
      first: props.index === 0,
      [effect ?? '']: !!effect,
    }"
  >
    <component :is="realEffectComponent" v-if="realEffectComponent" v-bind="effectConfig" />
    <ImageBg v-else v-bind="props" />

    <div class="hero-container">
      <div class="hero-content">
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
              :icon="action.icon"
              :suffix-icon="action.suffixIcon"
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

.vp-home-hero.first {
  margin-top: calc(0px - var(--vp-nav-height));
}

.vp-home-hero.full {
  height: 100vh;
}

.vp-home-hero.full.once {
  height: calc(100vh - var(--vp-footer-height, 0px));
}

.hero-container {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.vp-home-hero.full .hero-container {
  align-items: center;
  justify-content: center;
}

.vp-home-hero:not(.full) .hero-container {
  padding-top: 80px;
  padding-bottom: 80px;
}

.hero-content {
  width: max-content;
  max-width: 960px;
  padding: 0 20px;
  margin: 0 auto;
  text-align: center;
  pointer-events: none;
}

.vp-home-hero.full .hero-container .hero-content {
  margin-top: -40px;
}

.hero-name,
.hero-tagline {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  font-size: 48px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.5px;
  pointer-events: auto;
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
  pointer-events: auto;
  transition: color var(--vp-t-color);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 30px 0 0;
}

.action {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  justify-content: center;
}

.action :deep(.vp-button) {
  margin-left: 0;
  pointer-events: auto;
}

.action :deep(.vp-button:last-of-type) {
  margin-right: 0;
}

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

<style>
html.no-transition *,
html.no-transition *::before,
html.no-transition *::after {
  background-attachment: initial !important;
  transition-delay: 0s !important;
  transition-duration: 0s !important;
  animation-duration: 1ms !important;
  animation-delay: -1ms !important;
  animation-iteration-count: 1 !important;
}

html[class*="effect-"].force-dark .vp-navbar-appearance {
  display: none;
}

html[class*="effect-"].force-dark * {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizelegibility !important;
}

html[class*="effect-"].force-dark .vp-navbar,
html[class*="effect-"].force-dark .vp-navbar:not(.top) {
  background: rgb(15 15 15 / 0.7) !important;
  backdrop-filter: blur(10px);
}
</style>
