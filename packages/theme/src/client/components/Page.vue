<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import PostMeta from '@theme-plume/PostMeta.vue'
import Sidebar from '@theme-plume/Sidebar.vue'
import { usePageData } from '@vuepress/client'
import { computed, nextTick, onUnmounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared'
import { useDarkMode, useThemeLocaleData } from '../composables'
import { getCssValue } from '../utils'
import Toc from './Toc'
const page = usePageData<PlumeThemePageData>()
const route = useRoute()
const themeLocale = useThemeLocaleData()
const isDarkMode = useDarkMode()

const isNote = computed(() => {
  return page.value.isNote || false
})

const enabledSidebar = computed(() => {
  return isNote.value
})

let layout: HTMLElement | null
watchEffect(async () => {
  await nextTick()
  if (!enabledSidebar.value) return
  layout = document.querySelector('.plume-theme')
  const footer: HTMLElement | null = document.querySelector(
    '.theme-plume-footer'
  )
  if (themeLocale.value.footer) {
    const h = getCssValue(footer, 'height')
    layout?.setAttribute('style', `padding-bottom: ${h}px`)
  } else {
    layout?.setAttribute('style', `padding-bottom: 0`)
  }
})

onUnmounted(() => {
  layout?.removeAttribute('style')
})
</script>
<template>
  <DropdownTransition>
    <main class="page-wrapper">
      <slot name="top"></slot>
      <div class="page-container" :class="{ 'has-sidebar': enabledSidebar }">
        <main class="plume-theme-content">
          <Sidebar v-if="enabledSidebar" />
          <div class="page-content">
            <h1>{{ page.title }}</h1>
            <PostMeta :post="page" type="post" :border="true" />
            <Content />
            <div class="comment-container">
              <CommentService :darkmode="isDarkMode" />
            </div>
          </div>
          <div v-if="page.headers?.length > 0" class="plume-theme-page-toc">
            <Toc />
          </div>
        </main>
      </div>
      <slot name="bottom"></slot>
    </main>
  </DropdownTransition>
</template>
<style lang="scss">
@import '../styles/_mixins';
@import '../styles/variables';
.page-wrapper {
  @include wrapper;

  .page-container {
    display: flex;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;

    .plume-theme-content {
      @include container_wrapper;
      @include content;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex: 1;
    }

    .page-content {
      flex: 1;
      width: 100%;
      max-width: var(--content-width);
      padding: 0 2rem 1rem;
      margin: auto;
    }

    img {
      max-width: 100%;
    }

    &.has-sidebar {
      padding-top: 0;
      padding-bottom: 0;

      .plume-theme-content {
        max-width: 100%;
      }
    }
  }
}
.comment-container {
  margin-top: 8rem;
}

@media (max-width: $MQMobile) {
  .page-wrapper .page-container .page-content {
    padding: 0 0.75rem 1rem;
  }
  .plume-theme-page-toc {
    display: none;
  }
}
</style>
