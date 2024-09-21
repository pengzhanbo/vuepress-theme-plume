<script setup lang="ts">
import type { PlumeThemeHomeTextImage } from '../../../shared/index.js'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import VPImage from '@theme/VPImage.vue'
import { computed } from 'vue'

const props = defineProps<PlumeThemeHomeTextImage>()

const maxWidth = computed(() => {
  const width = props.width

  if (typeof width === 'number')
    return `${width}px`

  return width
})
</script>

<template>
  <VPHomeBox
    class="vp-home-text-image"
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :container-class="{ reverse: type === 'text-image' }"
  >
    <div class="content-image">
      <VPImage :image="image" :style="{ maxWidth }" />
    </div>

    <div class="content-text vp-doc">
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
  </VPHomeBox>
</template>

<style scoped>
.vp-home-text-image :deep(.container) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: space-around;
  max-width: 1152px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .vp-home-text-image :deep(.container) {
    flex-direction: row;
  }

  .vp-home-text-image :deep(.container.reverse) {
    flex-direction: row-reverse;
  }
}

.content-image :deep(.vp-image) {
  width: 100%;
  max-width: 128px;
  margin: 0 auto;
}

.content-text h2 {
  margin-top: 0;
  margin-bottom: 12px;
}

.content-text ul {
  margin-left: -20px;
}

.content-text .description {
  margin: 12px 0 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.content-text ul h3 {
  margin: 0;
  font-size: 16px;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.content-text ul p {
  margin: 0;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.content-text ul li :only-child {
  font-weight: 500;
}

@media (min-width: 768px) {
  .content-image :deep(.vp-image) {
    max-width: 180px;
    margin: 0 48px;
  }

  .content-text {
    flex: 1;
  }
}

@media (min-width: 960px) {
  .vp-home-text-image :deep(.container) {
    gap: 48px;
  }

  .content-image :deep(.vp-image) {
    max-width: 220px;
    margin: 0 96px;
  }

  .content-text {
    display: flex;
    justify-content: center;
    max-width: 80%;
  }
}
</style>
