<script lang="ts" setup>
import { usePageFrontmatter, withBase } from '@vuepress/client'
import { computed } from 'vue'
import type { PlumeThemeHomeFrontmatter } from '../../shared/index.js'
import { useThemeLocaleData } from '../composables/index.js'
import VButton from './VButton.vue'

const matter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
const theme = useThemeLocaleData()

const homeStyle = computed(() => {
  return {
    'background-image': `url(${withBase(matter.value.banner || '')})`,
  }
})

const name = computed(() => matter.value.hero?.name)
const profession = computed(() => matter.value.hero?.profession)
const text = computed(() => matter.value.hero?.text)

const actions = computed(() => {
  return matter.value.hero?.actions ?? []
})
</script>
<template>
  <div class="plume-home" :style="homeStyle">
    <div class="container">
      <div v-if="matter.hero" class="content">
        <h2 v-if="name" class="hero-name">{{ name }}</h2>
        <p v-if="profession" class="hero-profession">
          <span class="line"></span> <span>{{ profession }}</span>
        </p>
        <p v-if="text" class="hero-text">{{ text }}</p>
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
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: calc(100vh - var(--vp-nav-height));
  filter: var(--vp-home-hero-image-filter);
}

.plume-home .container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
  padding-top: 4rem;
}

.plume-home .content {
  padding: 0 2rem;
}

@media (min-width: 960px) {
  .plume-home .container {
    max-width: 768px;
    padding-top: 8rem;
  }
}

@media (min-width: 1440px) {
  .plume-home .container {
    max-width: 1104px;
    padding-top: 8rem;
  }

  .plume-home .content .hero-profession {
    font-size: 32px;
  }
}

.plume-home .content .hero-name {
  font-size: 100px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-hero-name);
}
.plume-home .content .hero-profession {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: 1rem;
  color: var(--vp-c-text-hero-profession);
  line-height: 1.25;
}

.plume-home .content .hero-profession .line {
  display: inline-block;
  width: 80px;
  height: 0;
  border-top: solid 1px var(--vp-c-text-hero-profession);
  margin-right: 1rem;
}

.plume-home .content .hero-text {
  width: 100%;
  max-width: 700px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 1.5rem;
  color: var(--vp-c-text-hero-text);
  padding: 6px 20px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.25);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
  padding-top: 24px;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}
</style>
