<script lang="ts" setup>
import { useBlogExtract, useTags } from '../../composables/index.js'
import ShortPostList from './ShortPostList.vue'

const { tags, currentTag, postList, handleTagClick } = useTags()
const { tags: tagsLink } = useBlogExtract()
</script>

<template>
  <div class="tags-wrapper" :class="{ 'has-list': postList.length > 0 }">
    <div class="tags-nav">
      <h2 class="tags-title">
        <span class="vpi-tag icon" />
        <span>{{ tagsLink.text }}</span>
      </h2>
      <div class="tags">
        <p
          v-for="tag in tags"
          :key="tag.name"
          class="tag"
          :class="{ active: tag.name === currentTag }"
          :style="{ '--vp-tag-color': tag.colors[0], '--vp-tag-hover-color': tag.colors[1] }"
          @click="handleTagClick(tag.name)"
        >
          <span class="tag-name">{{ tag.name }}</span>
          <span class="tag-count">{{ tag.count }}</span>
        </p>
      </div>
    </div>

    <div v-if="currentTag" class="tags-container">
      <h3 class="tag-title">
        {{ currentTag }}
      </h3>

      <ShortPostList v-if="postList.length" :post-list="postList" />
    </div>
  </div>
</template>

<style scoped>
.tags-wrapper {
  flex: 1;
  padding: 32px 24px;
  margin: 0 auto;
}

.tags-wrapper.has-list {
  padding-bottom: 64px;
}

.tags-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.tags-title .icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.tags .tag {
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 12px;
  margin: 6px;
  font-size: 14px;
  line-height: 1;
  color: var(--vp-c-bg);
  word-wrap: break-word;
  cursor: pointer;
  background-color: var(--vp-tag-color);
  border: solid 1px var(--vp-tag-color);
  border-radius: 6px;
  transition: all var(--t-color);
}

.tag-title {
  padding-bottom: 8px;
  margin: 20px 12px -10px;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-bottom var(--t-color);
}

.tag-count {
  display: inline-block;
  padding-left: 6px;
  margin-left: 4px;
  color: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-bg);
  transition: color var(--t-color), border-left var(--t-color);
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
  .tags-wrapper {
    padding: 32px 0;
    margin-left: 20px;
  }

  .tags-nav,
  .tags-container {
    padding: 20px;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--t-color);
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
    margin-top: 0;
  }
}

@media (min-width: 1200px) {
  .tags-wrapper {
    margin-left: 0;
  }
}
</style>
