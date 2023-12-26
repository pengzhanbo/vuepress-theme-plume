<script lang="ts" setup>
import { computed } from 'vue'
import { useBlogExtract, useThemeLocaleData } from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import IconArchive from './icons/IconArchive.vue'
import IconTag from './icons/IconTag.vue'


const theme = useThemeLocaleData()

const avatar = computed(() => theme.value.avatar)
const { hasBlogExtract, tags, archives } = useBlogExtract()
</script>

<template>
  <div v-if="avatar" class="blog-aside-wrapper">
    <div class="avatar-profile">
      <p v-if="avatar.url">
        <img :src="avatar.url" :alt="avatar.name" />
      </p>
      <div>
        <h3>{{ avatar.name }}</h3>
        <p>{{ avatar.description }}</p>
      </div>
    </div>
    <div v-if="hasBlogExtract" class="blog-nav">
      <AutoLink class="nav-link" :href="tags.link">
        <IconTag class="icon" />
        <span>{{ tags.text }}</span>
      </AutoLink>
      <AutoLink class="nav-link" :href="archives.link">
        <IconArchive class="icon" />
        <span>{{ archives.text }}</span>
      </AutoLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-aside-wrapper {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  width: 270px;
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 12rem;
  border-left: solid 1px var(--vp-c-divider);
  text-align: center;
  padding: 1rem 0;

  img {
    width: 50%;
    margin: auto;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .blog-aside-wrapper {
    display: none;
  }
}

.blog-nav {
  padding: 10px 24px 0;
  margin: 24px 24px 0;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: solid 1px var(--vp-c-divider);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 3px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  border-radius: 8px;
  transition: all var(--t-color);
}
.nav-link:hover {
  color: var(--vp-c-brand-2);
}

.nav-link .icon {
  margin-right: 4px;
  width: 1em;
  height: 1em;
}
</style>
