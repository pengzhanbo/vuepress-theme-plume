<script setup lang="ts">
import type { ThemeHomeDocHero } from '../../../shared/index.js'
import VPButton from '@theme/VPButton.vue'
import VPImage from '@theme/VPImage.vue'
import { computed } from 'vue'

const props = defineProps<ThemeHomeDocHero>()

const hero = computed(() => props.hero ?? {})
const actions = computed(() => hero.value.actions ?? [])
</script>

<template>
  <div class="vp-home-doc-hero" :class="{ 'has-image': hero.image }">
    <div class="container">
      <div class="main">
        <h1 class="heading">
          <span v-if="hero.name" class="name clip" v-html="hero.name" />
          <span v-if="hero.text" class="text" v-html="hero.text" />
        </h1>
        <p v-if="hero.tagline" class="tagline" v-html="hero.tagline" />

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

      <div v-if="hero.image" class="image">
        <div class="image-container">
          <div class="image-bg" />
          <slot name="home-doc-hero-image">
            <VPImage v-if="hero.image" class="image-src" :image="hero.image" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-home-doc-hero {
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px) 24px 48px;
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
}

@media (min-width: 640px) {
  .vp-home-doc-hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 48px 64px;
  }
}

@media (min-width: 960px) {
  .vp-home-doc-hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 64px 64px;
  }
}

.container {
  display: flex;
  flex-direction: column;
  max-width: 1152px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .container {
    flex-direction: row;
  }
}

.main {
  position: relative;
  z-index: 10;
  flex-grow: 1;
  flex-shrink: 0;
  order: 2;
}

.vp-home-doc-hero.has-image .container {
  text-align: center;
}

@media (min-width: 960px) {
  .vp-home-doc-hero.has-image .container {
    text-align: left;
  }
}

@media (min-width: 960px) {
  .main {
    order: 1;
    width: calc((100% / 3) * 2);
  }

  .vp-home-doc-hero.has-image .main {
    max-width: 592px;
  }
}

.heading {
  display: flex;
  flex-direction: column;
}

.name,
.text {
  width: fit-content;
  max-width: 392px;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.4px;
  white-space: pre-wrap;
}

.name {
  color: var(--vp-home-hero-name-color);
}

.text {
  color: var(--vp-home-hero-text, var(--vp-c-text-1));
}

.vp-home-doc-hero.has-image .name,
.vp-home-doc-hero.has-image .text {
  margin: 0 auto;
}

.clip {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}

@media (min-width: 640px) {
  .name,
  .text {
    max-width: 576px;
    font-size: 48px;
    line-height: 56px;
  }
}

@media (min-width: 960px) {
  .name,
  .text {
    font-size: 56px;
    line-height: 64px;
  }

  .vp-home-doc-hero.has-image .name,
  .vp-home-doc-hero.has-image .text {
    margin: 0;
  }
}

.tagline {
  max-width: 392px;
  padding-top: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: var(--vp-home-hero-tagline, var(--vp-c-text-2));
  white-space: pre-wrap;
}

.vp-home-doc-hero.has-image .tagline {
  margin: 0 auto;
}

@media (min-width: 640px) {
  .tagline {
    max-width: 576px;
    padding-top: 12px;
    font-size: 20px;
    line-height: 32px;
  }
}

@media (min-width: 960px) {
  .tagline {
    font-size: 24px;
    line-height: 36px;
  }

  .vp-home-doc-hero.has-image .tagline {
    margin: 0;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  padding-top: 24px;
  margin: -6px;
}

.vp-home-doc-hero.has-image .actions {
  justify-content: center;
}

@media (min-width: 640px) {
  .actions {
    padding-top: 32px;
  }
}

@media (min-width: 960px) {
  .vp-home-doc-hero.has-image .actions {
    justify-content: flex-start;
  }
}

.action {
  flex-shrink: 0;
  padding: 6px;
}

.image {
  order: 1;
  margin: -76px -24px -48px;
}

@media (min-width: 640px) {
  .image {
    margin: -108px -24px -48px;
  }
}

@media (min-width: 960px) {
  .image {
    flex-grow: 1;
    order: 2;
    min-height: 100%;
    margin: 0;
  }
}

.image-container {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .image-container {
    width: 392px;
    height: 392px;
  }
}

@media (min-width: 960px) {
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    /* rtl:ignore */
    transform: translate(-32px, -32px);
  }
}

.image-bg {
  position: absolute;
  top: 50%;

  /* rtl:ignore */
  left: 50%;
  width: 192px;
  height: 192px;
  background-image: var(--vp-home-hero-image-background-image);
  filter: var(--vp-home-hero-image-filter);
  border-radius: 50%;

  /* rtl:ignore */
  transform: translate(-50%, -50%);
}

@media (min-width: 640px) {
  .image-bg {
    width: 256px;
    height: 256px;
  }
}

@media (min-width: 960px) {
  .image-bg {
    width: 320px;
    height: 320px;
  }
}

:deep(.image-src) {
  position: absolute;
  top: 50%;

  /* rtl:ignore */
  left: 50%;
  max-width: 192px;
  max-height: 192px;

  /* rtl:ignore */
  transform: translate(-50%, -50%);
}

@media (min-width: 640px) {
  :deep(.image-src) {
    max-width: 256px;
    max-height: 256px;
  }
}

@media (min-width: 960px) {
  :deep(.image-src) {
    max-width: 320px;
    max-height: 320px;
  }
}
</style>
