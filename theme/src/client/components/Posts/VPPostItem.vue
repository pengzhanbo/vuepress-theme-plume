<script lang="ts" setup>
import type { PostsCoverStyle, ThemePostsItem } from '../../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { isMobile as _isMobile } from '@vuepress/helper/client'
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import { useData, useInternalLink, useTagColors } from '../../composables/index.js'

const props = defineProps<{
  post: ThemePostsItem
  index: number
}>()

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = _isMobile(navigator.userAgent)
  window.addEventListener('resize', () => {
    isMobile.value = _isMobile(navigator.userAgent)
  })
})

const { collection } = useData<'page', 'post'>()
const colors = useTagColors()
const { categories: categoriesLink, tags: tagsLink } = useInternalLink()

const createTime = computed(() => props.post.createTime?.split(/\s|T/)[0].replace(/\//g, '-'))
const categoryList = computed(() => props.post.categoryList ?? [])

const sticky = computed(() => {
  if (typeof props.post.sticky === 'boolean') {
    return props.post.sticky
  }
  else if (typeof props.post.sticky === 'number') {
    return props.post.sticky >= 0
  }
  return false
})

const tags = computed(() => {
  const tagTheme = collection.value?.tagsTheme ?? 'colored'

  return (props.post.tags ?? [])
    .slice(0, 4)
    .map(tag => ({
      name: tag,
      className: colors.value[tag] ? `vp-tag-${colors.value[tag]}` : `tag-${tagTheme}`,
    }))
})

const cover = computed<PostsCoverStyle | null>(() => {
  if (!props.post.cover)
    return null
  const opt = collection.value?.postCover ?? 'right'
  const options = typeof opt === 'string' ? { layout: opt } : opt
  return { layout: 'right', ratio: '4:3', ...options, ...props.post.coverStyle }
})

const coverLayout = computed(() => {
  if (isMobile.value)
    return 'top'
  const layout = cover.value?.layout ?? 'right'
  const odd = (props.index + 1) % 2 === 1
  if (layout === 'odd-left')
    return odd ? 'left' : 'right'
  if (layout === 'odd-right')
    return odd ? 'right' : 'left'
  return layout
})

const coverCompact = computed(() => {
  if (props.post.excerpt || coverLayout.value === 'top')
    return false
  return cover.value?.compact ?? false
})

const coverStyles = computed(() => {
  if (!cover.value)
    return null
  let ratio: number
  if (typeof cover.value.ratio === 'number') {
    ratio = cover.value.ratio
  }
  else {
    const [w, h] = cover.value.ratio!.split(/[:/]/).map(Number)
    ratio = h / w
  }
  if (coverLayout.value === 'left' || coverLayout.value === 'right') {
    const w = cover.value.width ?? 240
    return { width: `${w}px`, height: `${w * ratio}px` }
  }

  return { height: 0, paddingBottom: `${ratio * 100}%` }
})
</script>

<template>
  <div
    class="vp-post-item" data-allow-mismatch
    :class="{ 'has-cover': post.cover, [coverLayout]: cover, 'draft': post.draft }"
  >
    <div
      v-if="post.cover" class="post-cover" data-allow-mismatch
      :class="{ compact: coverCompact }" :style="coverStyles"
    >
      <img :src="withBase(post.cover)" :alt="post.title" loading="lazy">
    </div>
    <div class="post-item-content">
      <h3>
        <span v-if="sticky" class="sticky">TOP</span>
        <span v-if="post.draft" class="draft">DRAFT</span>
        <span v-if="post.encrypt" class="icon-lock vpi-lock" />
        <VPLink :href="post.path" :text="post.title" />
      </h3>
      <div class="post-meta">
        <div v-if="categoryList.length" class="category-list">
          <span class="icon vpi-folder" />
          <template v-for="(cate, i) in categoryList" :key="i">
            <VPLink :href="categoriesLink ? `${categoriesLink.link}?id=${cate.id}` : undefined">
              {{ cate.name }}
            </VPLink>
            <span v-if="i !== categoryList.length - 1">/</span>
          </template>
        </div>
        <div v-if="tags.length" class="tag-list">
          <span class="icon vpi-tag" />
          <template v-for="tag in tags" :key="tag.name">
            <VPLink
              class="tag"
              :class="tag.className"
              :href="tagsLink ? `${tagsLink.link}?tag=${tag.name}` : undefined"
            >
              {{ tag.name }}
            </VPLink>
          </template>
        </div>
        <div v-if="createTime" class="create-time">
          <span class="icon vpi-clock" />
          <span>{{ createTime }}</span>
        </div>
      </div>
      <div v-if="post.excerpt" class="vp-doc excerpt" v-html="post.excerpt" />
    </div>
  </div>
</template>

<style scoped>
.vp-post-item {
  padding: 16px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.vp-post-item.draft {
  background-color: var(--vp-c-warning-soft);
}

.vp-post-item.has-cover:where(.left, .right) {
  display: flex;
  gap: 20px;
}

@media (max-width: 419px) {
  .vp-post-item.has-cover:where(.left, .right) {
    display: block;
    gap: unset;
  }
}

.vp-post-item.has-cover.right {
  flex-direction: row-reverse;
}

.post-cover {
  position: relative;
  align-self: center;
  overflow: hidden;
  border-radius: 8px;
}

.vp-post-item.has-cover.left .post-cover.compact {
  margin: -24px 0 -24px -20px;
}

.vp-post-item.has-cover.right .post-cover.compact {
  margin: -24px -20px -24px 0;
}

.vp-post-item.has-cover.top .post-cover {
  margin: -16px -16px 16px;
  border-radius: 0;
}

@media (min-width: 419px) {
  .vp-post-item.has-cover.top .post-cover {
    width: calc(100% + 40px);
    margin: -24px -20px 24px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}

.post-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
  transform: scale(1);
}

.vp-post-item.has-cover:hover .post-cover img {
  transform: scale(1.02);
}

.vp-post-item.has-cover.left .post-cover.compact {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.vp-post-item.has-cover.right .post-cover.compact {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.post-item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vp-post-item.has-cover .post-item-content {
  flex: 1 2;
}

.post-item-content .sticky,
.post-item-content .draft {
  display: inline-block;
  padding: 3px 6px;
  margin-right: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-brand-soft);
  border-radius: 4px;
  transition: var(--vp-t-color);
  transition-property: color, background-color;
}

.post-item-content .draft {
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
}

.post-item-content .icon-lock {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  margin-left: 3px;
  color: var(--vp-c-text-3);
  transition: var(--vp-t-color);
  transition-property: color;
}

.post-item-content h3 {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.post-item-content h3 a {
  color: inherit;
  text-decoration: none;
}

.post-item-content h3:hover {
  color: var(--vp-c-brand-1);
}

.post-item-content h3:hover .sticky {
  color: var(--vp-c-text-2);
}

.post-item-content .excerpt {
  margin-top: 12px;
}

@media (min-width: 768px) {
  .vp-post-item {
    padding: 24px 20px;
    margin: 0;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: background-color, color, box-shadow;
    will-change: transform;
  }

  .vp-post-item:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .post-item-content .post-meta {
    margin-bottom: 0;
  }
}

.post-item-content .post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.post-item-content .post-meta > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.post-item-content .post-meta .tag-list {
  display: flex;
  align-items: center;
}

.post-item-content .post-meta .tag-list .tag {
  display: inline-block;
  padding: 3px 5px;
  margin-right: 6px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg);
  border-radius: 3px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.post-item-content .post-meta .tag-list .tag:last-of-type {
  margin-right: 0;
}

.post-item-content .post-meta .icon {
  width: 14px;
  height: 14px;
  margin-right: 0.3rem;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.post-item-content .post-meta a {
  font-weight: normal;
  color: inherit;
  text-decoration: none;
}

.excerpt.vp-doc :deep(p) {
  margin: 0.5rem 0;
}

.excerpt.vp-doc :deep(p:first-of-type) {
  margin-top: 0;
}

.excerpt.vp-doc :deep(p:last-of-type) {
  margin-bottom: 0;
}

.excerpt.vp-doc :deep(p strong) {
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.excerpt.vp-doc :deep(div[class*="language-"]) {
  margin: 16px -16px;
}

@media (min-width: 496px) {
  .excerpt.vp-doc :deep(div[class*="language-"]) {
    margin: 16px 0;
  }
}
</style>
