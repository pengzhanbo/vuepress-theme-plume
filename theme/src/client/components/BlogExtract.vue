<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogExtract, useThemeLocaleData } from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import IconArchive from './icons/IconArchive.vue'
import IconBlogExt from './icons/IconBlogExt.vue'
import IconTag from './icons/IconTag.vue'


const theme = useThemeLocaleData()
const route = useRoute()

const avatar = computed(() => theme.value.avatar)
const { hasBlogExtract, tags, archives } = useBlogExtract()
const open = ref(false)

watch(() => route.path, () => {
  open.value = false
})

const showBlogExtract = computed(() => {
  return avatar.value || hasBlogExtract.value
})
</script>
<template>
  <div v-if="showBlogExtract" class="blog-extract" @click="open = !open">
    <IconBlogExt class="icon" />
  </div>
  <div v-if="showBlogExtract" class="blog-modal" :class="{ open }" @click.self="open = false">
    <div class="blog-modal-container">
      <div v-if="avatar" class="avatar-profile">
        <p v-if="avatar.url" class="avatar">
          <img :src="avatar.url" :alt="avatar.name" />
        </p>
        <div>
          <h3>{{ avatar.name }}</h3>
          <p class="desc">{{ avatar.description }}</p>
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
  </div>
</template>

<style scoped>
.blog-extract {
  display: block;
  position: fixed;
  right: 0;
  bottom: 30%;
  padding: 4px 10px;
  border-top-left-radius: 99px;
  border-bottom-left-radius: 99px;
  border: solid 1px var(--vp-c-divider);
  border-right: none;
  box-shadow: var(--vp-shadow-2);
  z-index: calc(var(--vp-z-index-nav) - 1);
  background-color: var(--vp-c-bg);
}

.blog-extract .icon {
  font-size: 16px;
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .blog-extract {
    display: none;
  }
}

.blog-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  width: 100%;
  opacity: 0;
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateY(100%);
  transition: opacity 0.25s, transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  background-color: rgba(0, 0, 0, 0.3);
}

.blog-modal.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity 0.25s, transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.blog-modal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px;
  background-color: var(--vp-c-bg);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.avatar-profile {
  display: flex;
  align-items: center;
}

.avatar-profile .avatar {
  width: 64px;
  margin-right: 16px;
}

.avatar-profile h3 {
  font-weight: 600;
}

.avatar-profile .desc {
  font-size: 14px;
}

.blog-nav {
  padding: 10px 0 0;
  margin: 24px 0 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
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

.nav-link .icon {
  margin-right: 4px;
  width: 1em;
  height: 1em;
}
</style>
