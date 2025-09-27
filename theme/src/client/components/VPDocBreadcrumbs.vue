<script setup lang="ts">
import type { ResolvedSidebarItem, ThemePostCollection } from '../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { resolveRoute, resolveRouteFullPath, useRouteLocale } from 'vuepress/client'
import { removeEndingSlash } from 'vuepress/shared'
import {
  useData,
  useInternalLink,
  usePostsPageData,
  useSidebarData,
} from '../composables/index.js'
import { normalizeLink } from '../utils/index.js'

interface Breadcrumb {
  text: string
  link?: string
  current?: boolean
}

const { page, collection } = useData<'post'>()
const { isPosts } = usePostsPageData()
const { home, posts, categories } = useInternalLink()
const sidebar = useSidebarData()
const routeLocale = useRouteLocale()

const hasBreadcrumb = computed(() => {
  if (isPosts.value && page.value.categoryList)
    return page.value.categoryList.length > 0
  return sidebar.value.length > 0
})

const breadcrumbList = computed<Breadcrumb[]>(() => {
  if (!hasBreadcrumb.value)
    return []
  const list: Breadcrumb[] = [{ text: home.value.text, link: home.value.link }]

  if (isPosts.value) {
    if (((collection.value as ThemePostCollection | undefined)?.postList ?? true) && posts.value)
      list.push({ text: posts.value.text, link: posts.value.link })

    const categoryList = page.value.categoryList ?? []
    for (const category of categoryList) {
      list.push({
        text: category.name,
        link: categories.value ? `${categories.value.link}?id=${category.id}` : undefined,
      })
    }
  }
  else {
    if (collection.value) {
      const link = normalizeLink(routeLocale.value, collection.value.linkPrefix || collection.value.dir)
      const { notFound, meta, path } = resolveRoute<{ title?: string }>(link)
      path !== page.value.path && list.push({
        link: !notFound ? path : undefined,
        text: meta.title || collection.value.title || removeEndingSlash(collection.value.dir).split('/').pop() || '',
      })
    }
    if (sidebar.value.length > 0) {
      list.push(...(resolveSidebar(sidebar.value) || []))
    }
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
