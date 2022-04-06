<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import PostMeta from '@theme-plume/PostMeta.vue'
import { usePageData } from '@vuepress/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared'
import { useThemeLocaleData } from '../composables'
import Toc from './Toc'
const page = usePageData<PlumeThemePageData>()
const route = useRoute()
const themeLocale = useThemeLocaleData()

const isNote = computed(() => {
  return page.value.isNote || false
})
</script>
<template>
  <DropdownTransition>
    <main class="page-wrapper">
      <slot name="top"></slot>
      <div class="page-container">
        <main class="plume-theme-content">
          <div class="page-content">
            <h1>{{ page.title }}</h1>
            <PostMeta :post="page" type="post" :border="true" />
            <Content />
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
  }
}
</style>
