<script setup lang="ts">
import type { ThemeHomeConfigBase } from '../../../shared/index.js'
import { computed, normalizeClass } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useDarkMode } from '../../composables/index.js'

const { backgroundAttachment, backgroundImage, containerClass, full } = defineProps<ThemeHomeConfigBase & {
  containerClass?: any
}>()

const isDark = useDarkMode()

const styles = computed(() => {
  if (!backgroundImage)
    return null

  const image = typeof backgroundImage === 'string' ? backgroundImage : (backgroundImage[isDark.value ? 'dark' : 'light'] ?? backgroundImage.light)

  if (!image)
    return null

  const link = isLinkHttp(image) ? backgroundImage : withBase(image)
  return {
    'background-image': `url(${link})`,
    'background-size': 'cover',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-attachment': backgroundAttachment || '',
  }
})

const containerClasses = computed(() => normalizeClass(containerClass || ''))
</script>

<template>
  <div class="vp-home-box" :class="{ full }" :style="styles">
    <slot name="before" />
    <div class="container" :class="containerClasses">
      <slot />
    </div>
    <slot name="after" />
  </div>
</template>

<style>
.vp-home-box {
  position: relative;
  padding: 24px;
}

@media (min-width: 640px) {
  .vp-home-box {
    padding: 32px 48px;
  }
}

@media (min-width: 960px) {
  .vp-home-box {
    padding: 48px;
  }
}

.vp-home-box .container {
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
}

.vp-home-box.full {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height));
}
</style>
