<script setup lang="ts">
import { computed } from 'vue'
import type { PlumeThemeHomeFeatures } from '../../../shared/index.js'
import HomeFeature from './HomeFeature.vue'

const props = defineProps<{
  onlyOnce?: boolean
} & PlumeThemeHomeFeatures>()

const grid = computed(() => {
  const length = props.features?.length

  if (!length)
    return undefined

  else if (length === 2)
    return 'grid-2'

  else if (length === 3)
    return 'grid-3'

  else if (length % 3 === 0)
    return 'grid-6'

  else if (length > 3)
    return 'grid-4'

  return undefined
})
</script>

<template>
  <div v-if="features" class="home-features">
    <div class="container">
      <h2 v-if="title" class="title" v-html="title" />
      <p v-if="description" class="description" v-html="description" />
      <div class="items">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="item"
          :class="[grid]"
        >
          <HomeFeature
            :icon="feature.icon"
            :title="feature.title"
            :details="feature.details"
            :link="feature.link"
            :link-text="feature.linkText"
            :rel="feature.rel"
            :target="feature.target"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-features {
  position: relative;
  padding: 24px;
}

@media (min-width: 640px) {
  .home-features {
    padding: 24px 48px 48px;
  }
}

@media (min-width: 960px) {
  .home-features {
    padding: 48px 64px 64px;
  }
}

.container {
  max-width: 1152px;
  margin: 0 auto;
}

.container .title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 900;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--t-color);
}

.container .description {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--t-color);
}

@media (min-width: 768px) {
  .container .title {
    font-size: 24px;
  }

  .container .description {
    font-size: 18px;
  }
}

@media (min-width: 960px) {
  .container .title {
    font-size: 28px;
  }
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  width: 100%;
  padding: 8px;
}

@media (min-width: 640px) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}
</style>
