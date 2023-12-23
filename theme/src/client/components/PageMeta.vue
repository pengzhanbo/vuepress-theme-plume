<script lang="ts" setup>
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import { computed } from 'vue'
import type {
  PlumeThemePageData,
  PlumeThemePostFrontmatter,
} from '../../shared/index.js'
import IconClock from './icons/IconClock.vue'
import IconTag from './icons/IconTag.vue'

const page = usePageData<PlumeThemePageData>()
const matter = usePageFrontmatter<PlumeThemePostFrontmatter>()

const createTime = computed(() => {
  if (matter.value.createTime) {
    return matter.value.createTime.split(' ')[0].replace(/\//g, '-')
  }
  return ''
})

const categoryList = computed(() => {
  return page.value.categoryList ?? []
})

const tags = computed(() => {
  if (matter.value.tags) {
    return matter.value.tags.slice(0, 4)
  }
  return []
})

const hasMeta = computed(() => tags.value.length || createTime.value)
</script>
<template>
  <div
    v-if="page.isBlogPost && categoryList.length"
    class="page-category-wrapper"
  >
    <template
      v-for="({ type, name }, index) in categoryList"
      :key="index + '-' + type"
    >
      <span class="category">{{ name }}</span>
      <span v-if="index !== categoryList.length - 1" class="dot">&rsaquo;</span>
    </template>
  </div>
  <h2 v-if="page.isBlogPost" class="page-title" :class="{ padding: !hasMeta }">
    {{ page.title }}
  </h2>
  <div v-if="hasMeta" class="page-meta-wrapper">
    <p v-if="tags.length > 0">
      <IconTag class="icon" />
      <span v-for="tag in tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </p>
    <p v-if="createTime">
      <IconClock class="icon" /><span>{{ createTime }}</span>
    </p>
  </div>
</template>

<style scoped>
.page-category-wrapper {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 2rem;
  border-left: solid 4px var(--vp-c-brand-1);
  padding-left: 1rem;
}

.page-category-wrapper .category {
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}

.page-category-wrapper .category:hover {
  color: var(--vp-c-brand-1);
}

.page-category-wrapper .dot {
  margin: 0 0.2rem;
  color: var(--vp-c-text-3);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.page-title.padding {
  padding-bottom: 4rem;
}
.page-meta-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 0.5rem;
  margin-bottom: 2rem;
  color: var(--vp-c-text-3);
  font-size: 14px;
  border-bottom: solid 1px var(--vp-c-divider);
}

.page-meta-wrapper p {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.page-meta-wrapper .icon {
  width: 14px;
  height: 14px;
  margin-right: 0.3rem;
}

.page-meta-wrapper .tag {
  display: inline-block;
  line-height: 1;
  margin-right: 0.3rem;
  padding: 3px 6px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-mute);
  border-radius: 4px;
}

.page-meta-wrapper .tag:last-of-type {
  margin-right: 0;
}
</style>
