<script lang="ts" setup>
import { computed } from 'vue'
import { useReadingTimeLocale } from '@vuepress/plugin-reading-time/client'
import { useData, useTagColors } from '../composables/index.js'

const { page, frontmatter: matter } = useData<'post'>()

const colors = useTagColors()
const readingTime = useReadingTimeLocale()

const createTime = computed(() => {
  if (matter.value.createTime)
    return matter.value.createTime.split(' ')[0].replace(/\//g, '-')

  return ''
})

const categoryList = computed(() => {
  return page.value.categoryList ?? []
})

const tags = computed(() => {
  if (matter.value.tags) {
    return matter.value.tags.slice(0, 4).map(tag => ({
      name: tag,
      className: `vp-tag-${colors.value[tag]}`,
    }))
  }

  return []
})

const hasMeta = computed(() => readingTime.value.time || tags.value.length || createTime.value)
</script>

<template>
  <div
    v-if="page.isBlogPost && categoryList.length"
    class="page-category-wrapper"
  >
    <template
      v-for="({ type, name }, index) in categoryList"
      :key="`${index}-${type}`"
    >
      <span class="category">{{ name }}</span>
      <span v-if="index !== categoryList.length - 1" class="dot">&rsaquo;</span>
    </template>
  </div>
  <h1 class="page-title" :class="{ padding: !hasMeta }">
    {{ page.title }}
  </h1>
  <div v-if="hasMeta" class="page-meta-wrapper">
    <p v-if="matter.author" class="author">
      <span class="icon vpi-user" />
      <span>{{ matter.author }}</span>
    </p>
    <p v-if="readingTime.time && matter.readingTime !== false" class="reading-time">
      <span class="vpi-books icon" />
      <span>{{ readingTime.words }}</span>
      <span>{{ readingTime.time }}</span>
    </p>
    <p v-if="tags.length > 0">
      <span class="vpi-tag icon" />
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="tag"
        :class="tag.className"
      >
        {{ tag.name }}
      </span>
    </p>
    <p v-if="createTime" class="create-time">
      <span class="vpi-clock icon" /><span>{{ createTime }}</span>
    </p>
  </div>
</template>

<style scoped>
.page-category-wrapper {
  padding-left: 1rem;
  margin-bottom: 2rem;
  font-size: 16px;
  font-weight: 400;
  border-left: solid 4px var(--vp-c-brand-1);
  transition: border-left var(--t-color);
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
  margin-bottom: 0.7rem;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.page-title.padding {
  padding-bottom: 4rem;
}

.page-meta-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 0 0.5rem;
  margin-bottom: 2rem;
  font-size: 14px;
  color: var(--vp-c-text-3);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: color var(--t-color), border-bottom var(--t-color);
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

.page-meta-wrapper .author .icon,
.page-meta-wrapper .author span {
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}

.page-meta-wrapper .tag {
  display: inline-block;
  padding: 3px 5px;
  margin-right: 6px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-tag-color, var(--vp-c-text-3));
  background-color: var(--vp-tag-bg, var(--vp-c-default-soft));
  border-radius: 3px;
}

.page-meta-wrapper .tag:last-of-type {
  margin-right: 0;
}

.page-meta-wrapper .reading-time span {
  margin-right: 8px;
}

.page-meta-wrapper .reading-time span:last-of-type {
  margin-right: 0;
}

.page-meta-wrapper .create-time {
  min-width: 110px;
  margin-right: 0;
  text-align: right;
}

@media (min-width: 768px) {
  .page-meta-wrapper .create-time {
    flex: 1;
    justify-content: right;
  }
}
</style>
