<script setup lang="ts">
import type { ResolvedSidebarItem } from '../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { resolveRouteFullPath } from 'vuepress/client'
import {
  useBlogPageData,
  useData,
  useInternalLink,
  useSidebarData,
} from '../composables/index.js'

interface Breadcrumb {
  text: string
  link?: string
  current?: boolean
}

const { page, blog } = useData<'post'>()
const { isBlogPost } = useBlogPageData()
const { home, blog: blogLink, categories } = useInternalLink()
const sidebar = useSidebarData()

const hasBreadcrumb = computed(() => {
  if (isBlogPost.value && page.value.categoryList)
    return page.value.categoryList.length > 0
  return sidebar.value.length > 0
})

const breadcrumbList = computed<Breadcrumb[]>(() => {
  if (!hasBreadcrumb.value)
    return []
  const list: Breadcrumb[] = [{ text: home.value.text, link: home.value.link }]

  if (isBlogPost.value) {
    if (blog.value.postList ?? true)
      list.push({ text: blogLink.value.text, link: blogLink.value.link })

    const categoryList = page.value.categoryList ?? []
    for (const category of categoryList) {
      list.push({
        text: category.name,
        link: categories.value ? `${categories.value.link}?id=${category.id}` : undefined,
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
    const link = item.link ? resolveRouteFullPath(item.link) : undefined
    if (link === page.value.path) {
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
        <VPLink :href="link" class="breadcrumb" :class="{ current }" property="item" typeof="WebPage" :text="text" />
        <span v-if="index !== breadcrumbList.length - 1" class="vpi-chevron-right" />
        <meta property="name" :content="text">
        <meta property="position" :content="`${index + 1}`">
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.vp-breadcrumb {
  padding-left: 8px;
  margin-bottom: 2rem;
  border-left: solid 2px var(--vp-c-brand-1);
  transition: border-left var(--vp-t-color);
}

@media print {
  .vp-breadcrumb {
    display: none;
  }
}

.vp-breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 400;
}

.vp-breadcrumb ol li {
  display: flex;
  align-items: center;
}

.vp-breadcrumb .breadcrumb {
  font-weight: bold;
  color: var(--vp-c-brand-2);
  transition: color var(--vp-t-color);
}

.vp-breadcrumb .breadcrumb:hover {
  color: var(--vp-c-brand-1);
}

.vp-breadcrumb .breadcrumb.current {
  color: var(--vp-c-text-3);
}

.vp-breadcrumb .vpi-chevron-right {
  margin-left: 4px;
  color: var(--vp-c-border);
  transition: color var(--vp-t-color);
}
</style>
