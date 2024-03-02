<script setup lang="ts">
import { computed } from 'vue'
import { isLinkHttp } from 'vuepress/shared'
import { withBase } from 'vuepress/client'
import type { PlumeThemeHomeTextImage } from '../../../shared/index.js'
import VImage from '../VImage.vue'
import { useDarkMode } from '../../composables/index.js'

const props = defineProps<PlumeThemeHomeTextImage & { onlyOnce?: boolean }>()

const isDark = useDarkMode()

const maxWidth = computed(() => {
  const width = props.width

  if (typeof width === 'number')
    return `${width}px`

  return width
})

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
  <div class="home-text-image" :style="styles">
    <div class="container" :class="{ reverse: type === 'text-image' }">
      <div class="content-image">
        <VImage :image="image" :style="{ maxWidth }" />
      </div>
      <div class="content-text plume-content">
        <section>
          <h2 v-if="title" class="title">
            {{ title }}
          </h2>
          <p v-if="description" class="description" v-html="description" />
          <ul v-if="list && list.length" class="list">
            <li v-for="(item, index) in list" :key="index">
              <template v-if="typeof item === 'object'">
                <h3 v-if="item.title" v-html="item.title" />
                <p v-if="item.description" v-html="item.description" />
              </template>
              <p v-else v-html="item" />
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-text-image {
  position: relative;
  padding: 24px;
}

@media (min-width: 640px) {
  .home-text-image {
    padding: 32px 48px;
  }
}

@media (min-width: 960px) {
  .home-text-image {
    padding: 48px 64px;
  }
}

.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: space-around;
  max-width: 1152px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .container {
    flex-direction: row;
  }

  .container.reverse {
    flex-direction: row-reverse;
  }
}

.content-image :deep(.plume-image) {
  width: 100%;
  max-width: 128px;
  margin: 0 auto;
}

.content-text h2 {
  margin-top: 0;
}

.content-text ul {
  margin-left: -20px;
}

.content-text .description {
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.content-text ul h3 {
  margin: 0;
  font-size: 16px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.content-text ul p {
  margin: 0;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.content-text ul li :only-child {
  font-weight: 500;
}

@media (min-width: 768px) {
  .content-image :deep(.plume-image) {
    max-width: 160px;
    margin: 0 48px;
  }

  .content-text {
    flex: 1;
    width: 100%;
  }
}

@media (min-width: 960px) {
  .container {
    gap: 48px;
  }

  .content-image :deep(.plume-image) {
    max-width: 180px;
    margin: 0 96px;
  }

  .container .content-text {
    display: flex;
    justify-content: center;
    max-width: 80%;
  }
}
</style>
