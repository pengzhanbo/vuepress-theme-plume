<script lang="ts" setup>
import { computed } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { useExtraBlogData } from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import IconClock from './icons/IconClock.vue'
import IconFolder from './icons/IconFolder.vue'
import IconTag from './icons/IconTag.vue'

const props = defineProps<{
  post: PlumeThemeBlogPostItem
}>()

const extraData = useExtraBlogData()

const categoryList = computed(() =>
  props.post.categoryList ?? [],
)

const tags = computed(() =>
  (props.post.tags ?? [])
    .slice(0, 4)
    .map(tag => ({
      name: tag,
      colors: extraData.value.tagsColorsPreset[extraData.value.tagsColors[tag]],
    })),
)

const createTime = computed(() =>
  props.post.createTime?.split(' ')[0].replace(/\//g, '-'),
)
</script>

<template>
  <div class="post-item">
    <h3>
      <AutoLink :href="post.path">
        {{ post.title }}
      </AutoLink>
      <div
        v-if="typeof post.sticky === 'boolean' ? post.sticky : post.sticky >= 0"
        class="sticky"
      >
        TOP
      </div>
    </h3>
    <div class="post-meta">
      <div v-if="categoryList.length" class="category-list">
        <IconFolder class="icon" />
        <template v-for="(cate, i) in categoryList" :key="i">
          <span>{{ cate.name }}</span>
          <span v-if="i !== categoryList.length - 1">/</span>
        </template>
      </div>
      <div v-if="tags.length" class="tag-list">
        <IconTag class="icon" />
        <template v-for="tag in tags" :key="tag.name">
          <span
            class="tag"
            :style="{ '--vp-tag-color': tag.colors[0], '--vp-tag-bg-color': tag.colors[2] }"
          >
            {{ tag.name }}
          </span>
        </template>
      </div>
      <div v-if="createTime" class="create-time">
        <IconClock class="icon" />
        <span>{{ createTime }}</span>
      </div>
    </div>
    <div v-if="post.excerpt" class="plume-content" v-html="post.excerpt" />
  </div>
</template>

<style scoped>
.post-item {
  padding-top: 1rem;
  margin: 0 1.75rem 2rem;
}

.post-item:last-of-type {
  border-bottom: none;
}

.post-item .sticky {
  display: inline-block;
  padding: 3px 6px;
  margin-left: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
  border-radius: 4px;
}

.post-item h3 {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 18px;
  font-weight: 600;
  transition: color var(--t-color);
}

.post-item h3:hover {
  color: var(--vp-c-brand-1);
}

.post-item h3:hover .sticky {
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .post-item {
    padding: 24px 20px;
    margin: 0 0 24px 20px;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-2);
  }
}

@media (min-width: 960px) {
  .post-item {
    margin-left: 0;
  }

  .post-item h3 {
    font-size: 20px;
  }
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

.post-meta > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 1rem;
}

.post-meta > div:last-of-type {
  margin-right: 0;
}

.post-meta .tag-list {
  display: flex;
  align-items: center;
}

.post-meta .tag-list .tag {
  display: inline-block;
  padding: 3px 5px;
  margin-right: 6px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg-color);
  border-radius: 3px;
}

.post-meta .tag-list .tag:last-of-type {
  margin-right: 0;
}

.post-meta .icon {
  width: 14px;
  height: 14px;
  margin: 0.3rem;
  color: var(--vp-c-text-3);
}

.plume-content :deep(p) {
  margin: 0.5rem 0;
}

.plume-content :deep(p:first-of-type) {
  margin-top: 0;
}

.plume-content :deep(p:last-of-type) {
  margin-bottom: 0;
}

.plume-content :deep(p strong) {
  color: var(--vp-c-text-2);
}
</style>
