<script lang="ts" setup>
import VPLink from '@theme/VPLink.vue'
import { useRoute } from 'vuepress/client'
import { useBlogExtract } from '../../composables/index.js'

const props = defineProps<{
  isLocal?: boolean
}>()

const route = useRoute()

const { hasBlogExtract, tags, archives, categories } = useBlogExtract()
</script>

<template>
  <div v-if="hasBlogExtract" class="vp-blog-nav" :class="{ local: props.isLocal }">
    <VPLink
      v-if="tags.link"
      class="nav-link"
      :class="{ active: route.path === tags.link }"
      :href="tags.link"
    >
      <span class="icon icon-logo vpi-tag" />
      <span class="text">{{ tags.text }}</span>
      <span class="total">{{ tags.total }}</span>
      <span class="icon vpi-chevron-right" />
    </VPLink>
    <VPLink
      v-if="categories.link"
      class="nav-link"
      :class="{ active: route.path === categories.link }"
      :href="categories.link"
    >
      <span class="icon icon-logo vpi-category" />
      <span class="text">{{ categories.text }}</span>
      <span class="total">{{ categories.total }}</span>
      <span class="icon vpi-chevron-right" />
    </VPLink>
    <VPLink
      v-if="archives.link"
      class="nav-link"
      :class="{ active: route.path === archives.link }"
      :href="archives.link"
    >
      <span class="icon icon-logo vpi-archive" />
      <span class="text">{{ archives.text }}</span>
      <span class="total">{{ archives.total }}</span>
      <span class="icon vpi-chevron-right" />
    </VPLink>
  </div>
</template>

<style scoped>
.vp-blog-nav {
  padding: 0;
  text-align: left;
}

.vp-blog-nav.local {
  display: none;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .vp-blog-nav.local {
    display: flex;
    gap: 24px;
  }
}

@media (min-width: 1200px) {
  .vp-blog-nav.local {
    margin-left: 0;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 14px 10px 20px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: var(--vp-t-color);
  transition-property: background-color, color, box-shadow, transform;
  transform: scale(1);
}

.nav-link:hover {
  box-shadow: var(--vp-shadow-2);
  transform: scale(1.002);
}

.nav-link:hover,
.nav-link.active {
  color: var(--vp-c-brand-1);
}

.vp-blog-nav.local .nav-link {
  flex: 1;
  max-width: 50%;
  margin-bottom: 0;
}

.vp-blog-nav.local .nav-link:last-of-type {
  margin-right: 0;
}

.nav-link .text {
  flex: 1;
  min-width: 0;
  padding-right: 14px;
}

.nav-link .total {
  padding-right: 8px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.nav-link .icon {
  width: 1em;
  height: 1em;
  font-size: 1.2em;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.nav-link .icon-logo {
  margin-right: 10px;
  color: var(--vp-c-brand-1);
}
</style>
