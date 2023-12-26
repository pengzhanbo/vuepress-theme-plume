<script lang="ts" setup>
import { useBlogExtract, useTags } from '../composables/index.js'
import IconTag from './icons/IconTag.vue'
import ShortPostList from './ShortPostList.vue'

const { tags, currentTag, postList, handleTagClick } = useTags()
const { tags: tagsLink } = useBlogExtract()
</script>

<template>
  <div class="tags-wrapper">
    <h2 class="tags-title">
      <IconTag class="icon" />
      <span>{{ tagsLink.text }}</span>
    </h2>
    <div class="tags">
      <p
        v-for="tag in tags"
        :key="tag.name"
        class="tag"
        :class="{ active: tag.name === currentTag }"
        @click="handleTagClick(tag.name)"
      >
        <span class="tag-name">{{ tag.name }}</span>
        <span class="tag-count">({{ tag.count }})</span>
      </p>
    </div>

    <ShortPostList v-if="postList.length" :post-list="postList" />
  </div>
</template>

<style scoped>
.tags-wrapper {
  padding: 32px 24px;
  flex: 1;
}
.tags-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 40px;
}
.tags-title .icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.tags .tag {
  display: inline-block;
  word-wrap: break-word;
  margin: 8px;
  padding: 2px 10px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--t-color);
}
.tags .tag:hover,
.tags .tag.active {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.tag-name {
  font-weight: 600;
}

.tag-count {
  margin-left: 4px;
}
</style>
