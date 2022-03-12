<script lang="ts" setup>
import Archives from '@theme/Archives.vue'
import Category from '@theme/Category.vue'
import Home from '@theme/Home.vue'
import NavBar from '@theme/NavBar.vue'
import Post from '@theme/Post.vue'
import Tags from '@theme/Tags.vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import type {
  PlumeThemePageData,
  PlumeThemePageFrontmatter,
} from '../../shared'

const pageData = usePageData<PlumeThemePageData>()
const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()

const layout = {
  category: Category,
  archives: Archives,
  tags: Tags,
}
</script>

<template>
  <div class="theme-container">
    <NavBar />
    <Home v-if="frontmatter.home" />
    <Post v-if="pageData.isPost" />
    <Component :is="layout[frontmatter.pageType]" v-if="frontmatter.pageType" />
  </div>
</template>
