<script setup lang="ts">
import { Content, withBase } from 'vuepress/client'
import { computed } from 'vue'
import { isLinkHttp } from 'vuepress/shared'
import type { PlumeThemeHomeCustom } from '../../../shared/index.js'
import { useDarkMode } from '../../composables/index.js'

const props = defineProps<PlumeThemeHomeCustom & { onlyOnce?: boolean }>()

const isDark = useDarkMode()

const styles = computed(() => {
  if (!props.backgroundImage)
    return null

  const image = typeof props.backgroundImage === 'string' ? props.backgroundImage : (props.backgroundImage[isDark.value ? 'dark' : 'light'] ?? props.backgroundImage.light)

  const link = isLinkHttp(image) ? props.backgroundImage : withBase(image)
  return {
    'background-image': `url(${link})`,
    'background-size': 'cover',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-attachment': props.backgroundAttachment || '',
  }
})
</script>

<template>
  <div class="home-custom" :style="styles">
    <div class="container">
      <Content class="plume-content" />
    </div>
  </div>
</template>

<style scoped>
.home-custom {
  position: relative;
  padding: 24px;
}

@media (min-width: 640px) {
  .home-custom {
    padding: 32px 48px;
  }
}

@media (min-width: 960px) {
  .home-custom {
    padding: 48px;
  }
}

.container {
  max-width: 1152px;
  margin: 0 auto;
}
</style>
