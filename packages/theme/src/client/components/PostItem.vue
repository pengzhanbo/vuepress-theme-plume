<script lang="ts" setup>
import { computed } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import AutoLink from './AutoLink.vue'
import IconClock from './icons/IconClock.vue'
import IconFolder from './icons/IconFolder.vue'
import IconTag from './icons/IconTag.vue'

const props = defineProps<{
  post: PlumeThemeBlogPostItem
}>()

const categoryList = computed(() => {
  return props.post.categoryList ?? []
})

const tags = computed(() => {
  return (props.post.tags ?? []).slice(0, 4)
})

const createTime = computed(() => {
  return props.post.createTime?.split(' ')[0].replace(/\//g, '-')
})
</script>
<template>
  <div class="post-item">
    <h3>
      <AutoLink :href="post.path">{{ post.title }}</AutoLink>
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
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
      <div v-if="createTime" class="create-time">
        <IconClock class="icon" />
        <span>{{ createTime }}</span>
      </div>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div v-if="post.excerpt" class="plume-content" v-html="post.excerpt"></div>
  </div>
</template>

<style lang="scss" scoped>
.post-item {
  padding-top: 1rem;
  margin: 0 1.75rem 3rem;
  // border-bottom: solid 1px var(--vp-c-divider);

  &:last-of-type {
    border-bottom: none;
  }

  h3 {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    transition: color var(--t-color);
    margin-bottom: 1rem;
  }

  h3:hover {
    color: var(--vp-c-brand);

    .sticky {
      color: var(--vp-c-text-2);
    }
  }

  .sticky {
    display: inline-block;
    font-weight: 600;
    padding: 3px 6px;
    margin-left: 0.5rem;
    border-radius: 4px;
    line-height: 1;
    font-size: 13px;
    color: var(--vp-c-text-2);
    background-color: var(--vp-c-bg-soft-mute);
  }
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;

  > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 1rem;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .icon {
    width: 14px;
    height: 14px;
    margin: 0.3rem;
    color: var(--vp-c-text-3);
  }
}
</style>
