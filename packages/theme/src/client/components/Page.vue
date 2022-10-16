<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import PostMeta from '@theme-plume/PostMeta.vue'
import Sidebar from '@theme-plume/Sidebar.vue'
import { usePageData } from '@vuepress/client'
import { computed } from 'vue'
import type { PlumeThemePageData } from '../../shared/index.js'
import { useDarkMode } from '../composables/index.js'
import Toc from './Toc.js'

const page = usePageData<PlumeThemePageData>()
const isDarkMode = useDarkMode()

const isNote = computed(() => {
  return page.value.isNote || false
})

const enabledSidebar = computed(() => {
  return isNote.value
})
</script>
<template>
  <DropdownTransition>
    <main class="page-wrapper">
      <slot name="top"></slot>
      <div class="page-container" :class="{ 'has-sidebar': enabledSidebar }">
        <main class="plume-theme-content">
          <Sidebar v-if="enabledSidebar" />
          <div class="page-content" :class="{ 'note-content': isNote }">
            <h1>{{ page.title }}</h1>
            <PostMeta :post="page" type="post" border />
            <Content class="post-content" />
            <div class="comment-container">
              <Comment :darkmode="isDarkMode" />
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
    // padding-top: 1.25rem;
    padding-bottom: 1.25rem;

    .plume-theme-content {
      @include container_wrapper;
      @include content;
      display: flex;
      flex: 1;
    }

    .page-content {
      flex: 1;
      width: 100%;
      max-width: var(--content-width);
      padding: 0 2rem 1rem;
      margin: 0 auto;

      &.note-content {
        max-width: var(--content-note-width);
      }
    }

    .post-content {
      padding-top: 2rem;
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

    h1 {
      font-size: 1.5rem;
    }
  }
  .plume-theme-page-toc {
    display: none;
  }
}
</style>
