<script setup lang="ts">
import VPDocHeader from '@theme/VPDocHeader.vue'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { useData, useRelatedPosts, useTagColors } from '../composables/index.js'

const { enabled, relatedPosts, title, label } = useRelatedPosts()
const { collection } = useData<'page', 'post'>()
const colors = useTagColors()

const tagTheme = computed(() => collection.value?.tagsTheme ?? 'colored')

function tagClass(tag: string): string {
  const color = colors.value[tag]
  return color ? `vp-tag-${color}` : `tag-${tagTheme.value}`
}

function formatDate(value: string): string {
  return value.split(/\s|T/)[0].replace(/\//g, '-')
}
</script>

<template>
  <section
    v-if="enabled && relatedPosts.length"
    class="vp-related-posts"
    :aria-label="label"
  >
    <VPDocHeader anchor="related-posts">
      {{ title }}
    </VPDocHeader>

    <ul class="related-list">
      <li v-for="item in relatedPosts" :key="item.path" class="related-item">
        <VPLink :href="item.path" class="related-link">
          <span class="related-title">{{ item.title }}</span>

          <span v-if="item.excerpt" class="related-excerpt">{{ item.excerpt }}</span>

          <span class="related-footer">
            <span v-if="item.tags?.length" class="related-tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="tag"
                :class="tagClass(tag)"
              >{{ tag }}</span>
            </span>

            <span v-if="item.createTime" class="related-time">{{ formatDate(item.createTime) }}</span>
            <span class="vpi-chevron-right related-arrow" />
          </span>
        </VPLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.vp-related-posts {
  margin-top: 48px;
}

.vp-related-posts .related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.vp-related-posts .related-item {
  display: flex;
  padding: 0;
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color var(--vp-t-color);
}

.vp-related-posts .related-item + .related-item {
  margin-top: 0;
}

.vp-related-posts .related-item:hover {
  border-color: var(--vp-c-brand-1);
}

.vp-related-posts .related-link {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
  padding: 12px 14px;
  font-weight: 400;
  color: inherit;
  text-decoration: none;
}

.vp-related-posts .related-link:hover,
.vp-related-posts .related-link:focus {
  color: inherit;
  text-decoration: none;
}

.vp-related-posts .related-link:focus-visible {
  border-radius: 8px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.vp-related-posts .related-tags {
  display: flex;
  flex: 1;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

.vp-related-posts .related-tags .tag {
  padding: 3px 5px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg);
  border-radius: 3px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-related-posts .related-title {
  display: -webkit-box;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.vp-related-posts .related-item:hover .related-title {
  color: var(--vp-c-brand-1);
}

.vp-related-posts .related-excerpt {
  display: -webkit-box;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.55;
  color: var(--vp-c-text-2);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.vp-related-posts .related-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.vp-related-posts .related-time {
  flex-shrink: 0;
}

.vp-related-posts .related-arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color), transform var(--vp-t-color);
}

.vp-related-posts .related-item:hover .related-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

@media print {
  .vp-related-posts {
    display: none;
  }
}
</style>
