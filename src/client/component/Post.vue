<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import type { PlumeThemePageData } from '../../shared'
import PostMeta from './PostMeta.vue'
const post = usePageData<PlumeThemePageData>()
</script>
<template>
  <main class="post-wrapper">
    <div class="post-container">
      <PostMeta :post="post" type="post" />
      <main class="post-content">
        <Content />
      </main>
    </div>
  </main>
</template>
