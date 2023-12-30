<script lang="ts" setup>
import { useBlogExtract, useTags } from '../composables/index.js'
import IconTag from './icons/IconTag.vue'
import ShortPostList from './ShortPostList.vue'

const { tags, currentTag, postList, handleTagClick } = useTags()
const { tags: tagsLink } = useBlogExtract()
</script>

<template>
  <div class="tags-wrapper" :class="{ 'has-list': postList.length > 0 }">
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
        :style="{ '--vp-tag-color': tag.color }"
        @click="handleTagClick(tag.name)"
      >
        <span class="tag-name">{{ tag.name }}</span>
        <span class="tag-count">{{ tag.count }}</span>
      </p>
    </div>

    <h3 v-if="currentTag" class="tag-title">
      {{ currentTag }}
    </h3>

    <ShortPostList v-if="postList.length" :post-list="postList" />
  </div>
</template>

<style scoped>
.tags-wrapper {
  padding: 32px 24px 168px;
  flex: 1;
}

.tags-wrapper.has-list {
  padding-bottom: 64px;
}
.tags-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 20px;
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
  display: flex;
  align-items: center;
  word-wrap: break-word;
  margin: 8px;
  padding: 6px 6px 6px 10px;
  /* background-color: var(--vp-c-default-soft); */
  /* color: var(--vp-c-text-2); */
  color: var(--vp-tag-color);
  border: solid 1px var(--vp-tag-color);
  line-height: 1;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--t-color);
}

.tag-title {
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
  margin: 20px 12px -10px 12px;
}

.tag-count {
  display: inline-block;
  border-left: 1px solid var(--vp-tag-color);
  padding-left: 6px;
  margin-left: 4px;
  color: var(--vp-tag-color);
  transition: all var(--t-color);
}

.tags .tag:hover,
.tags .tag.active {
  background-color: var(--vp-tag-color);
  color: var(--vp-c-bg);
}

.tags .tag:hover .tag-count,
.tags .tag.active .tag-count {
  color: var(--vp-bg);
  border-left-color: var(--vp-c-divider);
}
</style>
