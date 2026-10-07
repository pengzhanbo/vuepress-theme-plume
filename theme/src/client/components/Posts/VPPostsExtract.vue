<script lang="ts" setup>
import type { ProfileOptions } from '../../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { useScrollLock, useTimeoutFn } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRoute, withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import { useData, usePostsExtract } from '../../composables/index.js'
import { inBrowser } from '../../utils/index.js'

import '@vuepress/helper/transition/fade-in.css'

const { theme, collection } = useData<'page', 'post'>()
const route = useRoute()

const profile = computed(() => {
  const profile = collection.value?.type === 'post' ? collection.value.profile : undefined
  return (profile ?? theme.value.profile) as (ProfileOptions & { originalWidth?: number, originalHeight?: number } | false | undefined)
})

const imageUrl = computed(() => {
  if (!profile.value)
    return ''
  const url = profile.value?.avatar ?? profile.value?.url
  if (!url)
    return ''
  if (isLinkHttp(url))
    return url
  return withBase(url)
})

const { hasPostsExtract, tags, archives, categories } = usePostsExtract()

const postsExtractLabel = computed(() => theme.value.postsExtractLabel ?? 'Posts Navigation')

const open = ref(false)
const lazyOpen = ref(false)

const triggerEl = useTemplateRef<HTMLButtonElement>('trigger')
const modalEl = useTemplateRef<HTMLDivElement>('modal')

// 面板内可聚焦元素的候选集合，用于初始聚焦与焦点陷阱。
// Candidates for focusable elements inside the panel, used for the initial focus and the focus trap.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(): HTMLElement[] {
  if (!modalEl.value)
    return []
  return Array.from(modalEl.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/**
 * Esc 关闭面板；Tab 在面板内循环，避免焦点逃逸到被遮挡的页面内容。
 *
 * Escape closes the panel; Tab cycles inside it so focus never escapes
 * into the page content hidden behind the dialog.
 */
function onModalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }

  if (event.key !== 'Tab')
    return

  const focusable = getFocusable()
  if (!focusable.length) {
    event.preventDefault()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && (active === first || active === modalEl.value)) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

const isLocked = useScrollLock(inBrowser ? document.body : null)

// 延迟展开的定时器随组件作用域自动清理；关闭时提前停止，
// 避免面板已关闭后定时器仍把它标记为展开状态。
// The delayed-open timer is disposed with the component scope and is stopped early on
// close, so a closed panel can never be marked as opened afterwards.
const { start: scheduleLazyOpen, stop: cancelLazyOpen } = useTimeoutFn(() => {
  lazyOpen.value = true
}, 200, { immediate: false })

watch(() => route.path, () => {
  open.value = false
})

watch(open, (isOpen) => {
  if (isOpen) {
    scheduleLazyOpen()
  }
  else {
    cancelLazyOpen()
    lazyOpen.value = false
  }
})

// 打开时把焦点移入面板，关闭时归还给触发按钮，保证键盘用户不会丢失位置。
// Move focus into the panel on open and back to the trigger on close, so keyboard users never lose their place.
watch(open, (isOpen) => {
  if (!inBrowser)
    return

  if (isOpen) {
    nextTick(() => {
      modalEl.value?.focus({ preventScroll: true })
    })
  }
  else if (modalEl.value?.contains(document.activeElement)) {
    triggerEl.value?.focus()
  }
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

const showPostsExtract = computed(() => {
  return profile.value || hasPostsExtract.value
})
</script>

<template>
  <template v-if="showPostsExtract">
    <button
      ref="trigger"
      type="button"
      class="vp-posts-extract"
      :aria-label="postsExtractLabel"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="open = !open"
    >
      <span class="vpi-posts-ext icon" />
    </button>
    <Transition name="fade-in">
      <div
        v-show="open"
        ref="modal"
        class="posts-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="postsExtractLabel"
        tabindex="-1"
        @click.self="open = false"
        @keydown="onModalKeydown"
      >
        <div class="posts-modal-container" :class="{ open: lazyOpen }">
          <slot name="posts-extract-before" />

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
          <div v-if="showPostsExtract" class="posts-nav" :class="{ 'no-profile': !profile }">
            <VPLink v-if="tags.link" class="nav-link" :href="tags.link" no-icon>
              <span class="vpi-tag icon" />
              <span>{{ tags.text }}</span>
            </VPLink>
            <VPLink v-if="categories.link" class="nav-link" :href="categories.link" no-icon>
              <span class="vpi-category icon" />
              <span>{{ categories.text }}</span>
            </VPLink>
            <VPLink v-if="archives.link" class="nav-link" :href="archives.link" no-icon>
              <span class="vpi-archive icon" />
              <span>{{ archives.text }}</span>
            </VPLink>
          </div>

          <slot name="posts-extract-after" />
        </div>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.vp-posts-extract {
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
  outline: none;
  box-shadow: var(--vp-shadow-2);
  transition: var(--vp-t-color);
  transition-property: background-color, border, box-shadow;
}

.vp-posts-extract .icon {
  display: block;
  font-size: 16px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

@media (min-width: 768px) {
  .vp-posts-extract {
    display: none;
  }
}

@media print {
  .vp-posts-extract {
    display: none;
  }
}

.posts-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-overlay);
  width: 100%;
  background-color: rgb(0 0 0 / 0.3);
}

.posts-modal:focus {
  outline: none;
}

.posts-modal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px;
  background-color: var(--vp-c-bg);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow:
    0 -3px 12px rgb(0 0 0 / 0.1),
    0 -1px 4px rgb(0 0 0 / 0.1);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateY(100%);
}

[data-theme="dark"] .posts-modal-container {
  box-shadow:
    0 -3px 12px rgb(0 0 0 / 0.3),
    0 -1px 4px rgb(0 0 0 / 0.27);
}

.posts-modal-container.open {
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

.posts-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0 0;
  margin: 24px 0 0;
  border-top: solid 1px var(--vp-c-divider);
}

.posts-nav.no-profile {
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
