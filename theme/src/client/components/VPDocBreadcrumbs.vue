<script setup lang="ts">
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import VPLink from '@theme/VPLink.vue'
import {
  useBlogExtract,
  useBlogNavTitle,
  useBlogPageData,
  useData,
  useSidebarData,
} from '../composables/index.js'
import type { ResolvedSidebarItem } from '../../shared/index.js'

interface Breadcrumb {
  text: string
  link?: string
  current?: boolean
}

const { page } = useData<'post'>()
const routeLocale = useRouteLocale()
const { isBlogPost } = useBlogPageData()
const { categoriesLink, blogLink } = useBlogExtract()
const sidebar = useSidebarData()

const hasBreadcrumb = computed(() => {
  if (isBlogPost.value && page.value.categoryList)
    return page.value.categoryList.length > 0
  return sidebar.value.length > 0
})
const homeTitle = useBlogNavTitle('home')
const blogTile = useBlogNavTitle('blog')

const breadcrumbList = computed<Breadcrumb[]>(() => {
  if (!hasBreadcrumb.value)
    return []
  const list: Breadcrumb[] = [{ text: homeTitle.value, link: routeLocale.value }]

  if (isBlogPost.value) {
    list.push({ text: blogTile.value, link: blogLink.value })
    const categoryList = page.value.categoryList ?? []
    for (const category of categoryList) {
      list.push({
        text: category.name,
        link: `${categoriesLink.value}?id=${category.id}`,
      })
    }
  }
  else if (sidebar.value.length > 0) {
    list.push(...(resolveSidebar(sidebar.value) || []))
  }
  list.push({ text: page.value.title, link: page.value.path, current: true })
  return list
})

function resolveSidebar(
  sidebar: ResolvedSidebarItem[],
  result: Breadcrumb[] = [],
): Breadcrumb[] | null {
  for (const item of sidebar) {
    if (item.link === page.value.path) {
      return result
    }
    else if (item.items) {
      const res = resolveSidebar(
        item.items,
        [...result, { text: item.text!, link: item.link }],
      )
      if (res)
        return res
    }
  }
  return null
}
</script>

<template>
  <nav
    v-if="hasBreadcrumb"
    class="vp-breadcrumb"
  >
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li
        v-for="({ text, link, current }, index) in breadcrumbList"
        :key="link"
        property="itemListElement"
        typeof="ListItem"
      >
        <VPLink :href="link" class="breadcrumb" :class="{ current }" property="item" typeof="WebPage">
          {{ text }}
        </VPLink>
        <span v-if="index !== breadcrumbList.length - 1" class="vpi-chevron-right" />
        <meta property="position" :content="index + 1">
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.vp-breadcrumb {
  padding-left: 1rem;
  margin-bottom: 2rem;
  border-left: solid 4px var(--vp-c-brand-1);
  transition: border-left var(--t-color);
}

.vp-breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 400;
}

.vp-breadcrumb ol li {
  display: flex;
  align-items: center;
}

.vp-breadcrumb .breadcrumb {
  color: var(--vp-c-brand-2);
  transition: color var(--t-color);
}

.vp-breadcrumb .breadcrumb:hover {
  color: var(--vp-c-brand-1);
}

.vp-breadcrumb .breadcrumb.current {
  color: var(--vp-c-text-3);
}

.vp-breadcrumb .vpi-chevron-right {
  margin-left: 8px;
  color: var(--vp-c-text-3);
}
</style>
