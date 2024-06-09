<script lang="ts" setup>
import { computed } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../../shared/index.js'
import { useTagColors } from '../../composables/tag-colors.js'
import AutoLink from '../AutoLink.vue'

const props = defineProps<{
  post: PlumeThemeBlogPostItem
}>()

const colors = useTagColors()

const categoryList = computed(() =>
  props.post.categoryList ?? [],
)

const tags = computed(() =>
  (props.post.tags ?? [])
    .slice(0, 4)
    .map(tag => ({
      name: tag,
      className: `vp-tag-${colors.value[tag]}`,
    })),
)

const createTime = computed(() =>
  props.post.createTime?.split(' ')[0].replace(/\//g, '-'),
)
</script>

<template>
  <div class="post-item">
    <h3>
      <div
        v-if="typeof post.sticky === 'boolean' ? post.sticky : post.sticky >= 0"
        class="sticky"
      >
        TOP
      </div>
      <span v-if="post.encrypt" class="icon-lock vpi-lock" />
      <AutoLink :href="post.path">
        {{ post.title }}
      </AutoLink>
    </h3>
    <div class="post-meta">
      <div v-if="categoryList.length" class="category-list">
        <span class="icon vpi-folder" />
        <template v-for="(cate, i) in categoryList" :key="i">
          <span>{{ cate.name }}</span>
          <span v-if="i !== categoryList.length - 1">/</span>
        </template>
      </div>
      <div v-if="tags.length" class="tag-list">
        <span class="icon vpi-tag" />
        <template v-for="tag in tags" :key="tag.name">
          <span
            class="tag"
            :class="tag.className"
          >
            {{ tag.name }}
          </span>
        </template>
      </div>
      <div v-if="createTime" class="create-time">
        <span class="icon vpi-clock" />
        <span>{{ createTime }}</span>
      </div>
    </div>
    <div v-if="post.excerpt" class="plume-content excerpt" v-html="post.excerpt" />
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
  margin-right: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-brand-soft);
  border-radius: 4px;
  transition: var(--t-color);
  transition-property: color, background-color;
}

.post-item .icon-lock {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  margin-left: 3px;
  color: var(--vp-c-text-3);
  transition: var(--t-color);
  transition-property: color;
}

.post-item h3 {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
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
    box-shadow: var(--vp-shadow-1);
    transition: var(--t-color);
    transition-property: background-color, color, box-shadow;
    will-change: transform;
  }

  .post-item:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .post-item .post-meta {
    margin-bottom: 0;
  }

  .post-item .excerpt {
    margin-top: 24px;
  }
}

@media (min-width: 1200px) {
  .post-item {
    margin: 0 0 24px;
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
  transition: color var(--t-color);
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
  font-size: 12px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg);
  border-radius: 3px;
  transition: color var(--t-color), background-color var(--t-color);
}

.post-meta .tag-list .tag:last-of-type {
  margin-right: 0;
}

.post-meta .icon {
  width: 14px;
  height: 14px;
  margin: 0.3rem;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
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
  transition: color var(--t-color);
}
</style>
