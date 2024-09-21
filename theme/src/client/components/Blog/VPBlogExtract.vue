<script lang="ts" setup>
import VPLink from '@theme/VPLink.vue'
import { useScrollLock } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useBlogExtract, useData } from '../../composables/index.js'
import { inBrowser } from '../../utils/index.js'

const { theme } = useData()
const route = useRoute()

const profile = computed(() => theme.value.profile)
const imageUrl = computed(() => {
  const url = profile.value?.avatar ?? profile.value?.url
  if (!url)
    return ''
  if (isLinkHttp(url))
    return url
  return withBase(url)
})

const { hasBlogExtract, tags, archives, categories } = useBlogExtract()
const open = ref(false)
const lazyOpen = ref(false)

const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(() => route.path, () => {
  open.value = false
})

watch(open, async () => {
  if (open.value) {
    setTimeout(() => {
      lazyOpen.value = true
    }, 200)
  }
  else { lazyOpen.value = false }
})

watch(
  [() => open.value],
  () => {
    if (open.value)
      isLocked.value = true

    else isLocked.value = false
  },
  { immediate: true, flush: 'post' },
)

const showBlogExtract = computed(() => {
  return profile.value || hasBlogExtract.value
})
</script>

<template>
  <template v-if="showBlogExtract">
    <div class="vp-blog-extract" @click="open = !open">
      <span class="vpi-blog-ext icon" />
    </div>
    <Transition name="fade">
      <div v-show="open" class="blog-modal" @click.self="open = false">
        <div class="blog-modal-container" :class="{ open: lazyOpen }">
          <slot name="blog-extract-before" />

          <div v-if="profile" class="profile">
            <p v-if="imageUrl" class="avatar">
              <img :src="imageUrl" :alt="profile.name">
            </p>
            <div>
              <h3>{{ profile.name }}</h3>
              <p class="desc">
                {{ profile.description }}
              </p>
              <div class="profile-info">
                <div v-if="profile.location" class="profile-location">
                  <span class="vpi-location" />
                  <p v-if="profile.location" v-html="profile.location" />
                </div>
                <div v-if="profile.organization" class="profile-organization">
                  <span class="vpi-organization" />
                  <p v-if="profile.organization" v-html="profile.organization" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="hasBlogExtract" class="blog-nav" :class="{ 'no-profile': !profile }">
            <VPLink class="nav-link" :href="tags.link" no-icon>
              <span class="vpi-tag icon" />
              <span>{{ tags.text }}</span>
            </VPLink>
            <VPLink class="nav-link" :href="categories.link" no-icon>
              <span class="vpi-category icon" />
              <span>{{ categories.text }}</span>
            </VPLink>
            <VPLink class="nav-link" :href="archives.link" no-icon>
              <span class="vpi-archive icon" />
              <span>{{ archives.text }}</span>
            </VPLink>
          </div>

          <slot name="blog-extract-after" />
        </div>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.vp-blog-extract {
  position: fixed;
  right: 0;
  bottom: 30%;
  z-index: calc(var(--vp-z-index-nav) - 1);
  display: block;
  padding: 6px 10px;
  cursor: pointer;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-right: none;
  border-top-left-radius: 99px;
  border-bottom-left-radius: 99px;
  box-shadow: var(--vp-shadow-2);
  transition: var(--vp-t-color);
  transition-property: background-color, border, box-shadow;
}

.vp-blog-extract .icon {
  display: block;
  font-size: 16px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

@media (min-width: 768px) {
  .vp-blog-extract {
    display: none;
  }
}

@media print {
  .vp-blog-extract {
    display: none;
  }
}

.blog-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-overlay);
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.blog-modal.fade-enter-from,
.blog-modal.fade-leave-to {
  opacity: 0;
}

.blog-modal.fade-leave-active,
.blog-modal.fade-enter-active {
  transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.blog-modal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px;
  background-color: var(--vp-c-bg);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow:
    0 -3px 12px rgba(0, 0, 0, 0.1),
    0 -1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateY(100%);
}

[data-theme="dark"] .blog-modal-container {
  box-shadow:
    0 -3px 12px rgba(0, 0, 0, 0.3),
    0 -1px 4px rgba(0, 0, 0, 0.27);
}

.blog-modal-container.open {
  transform: translateY(0);
}

.profile {
  display: flex;
  align-items: center;
}

.profile .avatar {
  width: 64px;
  margin-right: 16px;
}

.profile h3 {
  font-weight: 600;
}

.profile .desc {
  font-size: 14px;
}

.blog-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0 0;
  margin: 24px 0 0;
  border-top: solid 1px var(--vp-c-divider);
}

.blog-nav.no-profile {
  padding-top: 0;
  margin: 0;
  border-top: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 3px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  border-radius: 8px;
  transition: all var(--vp-t-color);
}

.nav-link .icon {
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.profile-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
  align-items: center;
}

.profile-location,
.profile-organization {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.profile-location p,
.profile-organization p {
  margin: 0 4px;
}
</style>
