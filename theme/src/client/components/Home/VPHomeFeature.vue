<script setup lang="ts">
import type { ThemeHomeFeature } from '../../../shared/index.js'
import VPIcon from '@theme/VPIcon.vue'
import VPImage from '@theme/VPImage.vue'
import VPLink from '@theme/VPLink.vue'
import { isLinkAbsolute, isLinkHttp } from '@vuepress/helper/client'
import { computed } from 'vue'

const props = defineProps<ThemeHomeFeature>()

const ICONIFY_NAME = /^[\w-]+:[\w-]+$/

const isIconify = computed(() => {
  if (typeof props.icon !== 'string' || isLinkAbsolute(props.icon) || isLinkHttp(props.icon)) {
    return false
  }
  return ICONIFY_NAME.test(props.icon)
})
</script>

<template>
  <VPLink
    class="vp-home-feature"
    :href="link"
    :rel="rel"
    :target="target"
    no-icon
    :tag="link ? 'a' : 'div'"
  >
    <article class="box">
      <div v-if="typeof icon === 'object' && icon.wrap" class="icon">
        <VPImage
          :image="icon"
          :alt="icon.alt"
          :height="icon.height || 48"
          :width="icon.width || 48"
        />
      </div>
      <VPImage
        v-else-if="typeof icon === 'object'"
        :image="icon"
        :alt="icon.alt"
        :height="icon.height || 48"
        :width="icon.width || 48"
      />
      <div v-else-if="icon && isIconify" class="icon">
        <VPIcon :name="icon" />
      </div>
      <div v-else-if="icon" class="icon" v-html="icon" />
      <h2 class="title" v-html="title" />
      <p v-if="details" class="details" v-html="details" />

      <div v-if="linkText" class="link-text">
        <p class="link-text-value">
          {{ linkText }} <span class="vpi-arrow-right link-text-icon" />
        </p>
      </div>
    </article>
  </VPLink>
</template>

<style scoped>
.vp-home-feature {
  display: block;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  transition: border-color var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-home-feature.link:hover {
  border-color: var(--vp-c-brand-1);
}

.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
}

.box > :deep(.VPImage) {
  margin-bottom: 20px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  font-size: 24px;
  background-color: var(--vp-c-default-soft);
  border-radius: 6px;
  transition: background-color var(--vp-t-color);
}

.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.link-text {
  padding-top: 8px;
}

.link-text-value {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.link-text-icon {
  margin-left: 6px;
}
</style>
