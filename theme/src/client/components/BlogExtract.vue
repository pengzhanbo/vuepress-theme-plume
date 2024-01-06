<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogExtract, useThemeLocaleData } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'
import AutoLink from './AutoLink.vue'
import IconArchive from './icons/IconArchive.vue'
import IconBlogExt from './icons/IconBlogExt.vue'
import IconTag from './icons/IconTag.vue'

const theme = useThemeLocaleData()
const route = useRoute()

const avatar = computed(() => theme.value.avatar)
const { hasBlogExtract, tags, archives } = useBlogExtract()
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
  return avatar.value || hasBlogExtract.value
})
</script>

<template>
  <template v-if="showBlogExtract">
    <div class="blog-extract" @click="open = !open">
      <IconBlogExt class="icon" />
    </div>
    <Transition name="fade">
      <div v-show="open" class="blog-modal" @click.self="open = false">
        <div class="blog-modal-container" :class="{ open: lazyOpen }">
          <div v-if="avatar" class="avatar-profile">
            <p v-if="avatar.url" class="avatar">
              <img :src="avatar.url" :alt="avatar.name">
            </p>
            <div>
              <h3>{{ avatar.name }}</h3>
              <p class="desc">
                {{ avatar.description }}
              </p>
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
    </Transition>
  </template>
</template>

<style scoped>
.blog-extract {
  position: fixed;
  right: 0;
  bottom: 30%;
  z-index: calc(var(--vp-z-index-nav) - 1);
  display: block;
  padding: 4px 10px;
  cursor: pointer;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-right: none;
  border-top-left-radius: 99px;
  border-bottom-left-radius: 99px;
  box-shadow: var(--vp-shadow-2);
}

.blog-extract .icon {
  font-size: 16px;
  color: var(--vp-c-text-2);
}

@media (width >= 768px) {
  .blog-extract {
    display: none;
  }
}

@media print {
  .blog-extract {
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

.dark .blog-modal-container {
  box-shadow:
    0 -3px 12px rgba(0, 0, 0, 0.3),
    0 -1px 4px rgba(0, 0, 0, 0.27);
}

.blog-modal-container.open {
  transform: translateY(0);
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0 0;
  margin: 24px 0 0;
  border-top: solid 1px var(--vp-c-divider);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 3px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  border-radius: 8px;
  transition: all var(--t-color);
}

.nav-link .icon {
  width: 1em;
  height: 1em;
  margin-right: 4px;
}
</style>
