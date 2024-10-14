<script lang="ts" setup>
import VPShortPostList from '@theme/Blog/VPShortPostList.vue'
import { useInternalLink, useTags } from '../../composables/index.js'

const { tags: tagsLink } = useInternalLink()
const { tags, currentTag, postList, handleTagClick } = useTags()
</script>

<template>
  <div class="vp-blog-tags" :class="{ 'has-list': postList.length > 0 }">
    <slot name="blog-tags-before" />

    <div class="tags-nav">
      <h2 class="tags-title">
        <span class="vpi-tag icon" />
        <span>{{ tagsLink?.text ?? 'Tags' }}</span>
      </h2>
      <slot name="blog-tags-title-after" />
      <div class="tags">
        <p
          v-for="tag in tags"
          :key="tag.name"
          class="tag"
          :class="{ active: tag.name === currentTag, [tag.className]: true }"
          @click="handleTagClick(tag.name)"
        >
          <span class="tag-name">{{ tag.name }}</span>
          <span class="tag-count">{{ tag.count }}</span>
        </p>
      </div>
    </div>

    <slot name="blog-tags-content-before" />
    <div v-if="currentTag" class="tags-container">
      <h3 class="tag-title">
        {{ currentTag }}
      </h3>

      <VPShortPostList v-if="postList.length" :post-list="postList" />
    </div>

    <slot name="blog-tags-after" />
  </div>
</template>

<style scoped>
.vp-blog-tags {
  flex: 1;
}

.vp-blog-tags.has-list {
  padding-bottom: 64px;
}

.tags-nav,
.tags-container {
  padding: 20px 16px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.tags-container {
  margin-top: 24px;
}

.tags-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.tags-title .icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
}

.tags .tag {
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 12px;
  font-size: 14px;
  line-height: 1;
  color: var(--vp-tag-color);
  word-wrap: break-word;
  cursor: pointer;
  background-color: var(--vp-tag-bg);
  border: 1px solid var(--vp-tag-bg);
  border-radius: 6px;
  transition: all var(--vp-t-color);
}

.tag-title {
  padding-bottom: 12px;
  padding-left: 16px;
  margin: 0 -16px;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-bottom var(--vp-t-color);
}

.tag-count {
  display: inline-block;
  padding-left: 6px;
  margin-left: 4px;
  color: var(--vp-tag-color);
  border-left: 1px solid var(--vp-tag-color);
  transition: color var(--vp-t-color), border-left var(--vp-t-color);
}

.tags .tag:hover,
.tags .tag.active {
  color: var(--vp-c-bg);
  background-color: var(--vp-tag-hover-color);
}

.tags .tag:hover .tag-count,
.tags .tag.active .tag-count {
  color: var(--vp-c-bg);
  border-left-color: var(--vp-c-divider);
}

@media (min-width: 768px) {
  .tags-nav,
  .tags-container {
    padding: 16px 24px;
    margin: 0;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: background-color, box-shadow;
  }

  .tags-container {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .tags-nav:hover,
  .tags-container:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .tags-container .tag-title {
    padding-left: 24px;
    margin: 0 -24px;
  }
}

@media (min-width: 1200px) {
  .vp-blog-tags {
    margin-left: 0;
  }
}
</style>
