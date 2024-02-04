<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogExtract, useThemeLocaleData } from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import IconArchive from './icons/IconArchive.vue'
import IconTag from './icons/IconTag.vue'
import IconChevronRight from './icons/IconChevronRight.vue'

const theme = useThemeLocaleData()
const route = useRoute()

const avatar = computed(() => theme.value.avatar)
const { hasBlogExtract, tags, archives } = useBlogExtract()
</script>

<template>
  <div v-if="avatar" class="blog-aside-wrapper">
    <div class="avatar-profile">
      <p v-if="avatar.url" :class="{ circle: avatar.circle }">
        <img :src="avatar.url" :alt="avatar.name">
      </p>
      <div>
        <h3>{{ avatar.name }}</h3>
        <p>{{ avatar.description }}</p>
      </div>
    </div>
    <div v-if="hasBlogExtract" class="blog-nav">
      <AutoLink
        class="nav-link"
        :class="{ active: route.path === tags.link }"
        :href="tags.link"
      >
        <IconTag class="icon icon-logo" />
        <span class="text">{{ tags.text }}</span>
        <span class="total">{{ tags.total }}</span>
        <IconChevronRight class="icon" />
      </AutoLink>
      <AutoLink
        class="nav-link"
        :class="{ active: route.path === archives.link }"
        :href="archives.link"
      >
        <IconArchive class="icon icon-logo" />
        <span class="text">{{ archives.text }}</span>
        <span class="total">{{ archives.total }}</span>
        <IconChevronRight class="icon" />
      </AutoLink>
    </div>
  </div>
</template>

<style scoped>
.blog-aside-wrapper {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  display: none;
  width: 270px;
  margin: 2rem 1rem 0 2rem;
  text-align: center;
}

.blog-aside-wrapper img {
  width: 60%;
  margin: auto;

  object-fit: cover;
}

.blog-aside-wrapper h3 {
  margin-top: 1.5rem;
  font-size: 16px;
  font-weight: 600;
}

.avatar-profile {
  padding: 24px 20px;
  margin-bottom: 24px;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: var(--t-color);
  transition-property: background-color, color, box-shadow, transform;
  transform: scale(1);
}

.avatar-profile:hover {
  box-shadow: var(--vp-shadow-2);
  transform: scale(1.002);
}

.avatar-profile h3,
.avatar-profile p {
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.avatar-profile .circle img {
  overflow: hidden;
  border-radius: 50%;
}

.blog-nav {
  padding: 0;
  text-align: left;
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
  transition: var(--t-color);
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

.nav-link .text {
  flex: 1;
  min-width: 0;
  padding-right: 14px;
}

.nav-link .total {
  padding-right: 8px;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
}

.nav-link .icon {
  width: 1em;
  height: 1em;
  font-size: 1.2em;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
}

.nav-link .icon-logo {
  margin-right: 10px;
  color: var(--vp-c-brand-1);
}

@media (min-width: 768px) {
  .blog-aside-wrapper {
    margin: 2rem 1rem 2rem 1.25rem;
  }

  .blog-aside-wrapper {
    display: block;
  }
}
</style>
